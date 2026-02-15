
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini for stock notifications
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pizzacraft';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Schemas ---
const IngredientSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  stock: Number
});

const OrderSchema = new mongoose.Schema({
  userId: String,
  userEmail: String,
  total: Number,
  status: { type: String, default: 'Order Received' },
  items: Object,
  createdAt: { type: Date, default: Date.now }
});

const Ingredient = mongoose.model('Ingredient', IngredientSchema);
const Order = mongoose.model('Order', OrderSchema);

// --- Routes ---

// 1. Inventory Management
app.get('/api/inventory', async (req, res) => {
  const items = await Ingredient.find();
  res.json(items);
});

app.patch('/api/inventory/:id', async (req, res) => {
  const { stock } = req.body;
  const item = await Ingredient.findByIdAndUpdate(req.params.id, { stock }, { new: true });
  
  // Requirement #8: Stock Threshold Notification
  if (item && item.stock < 20) {
    const prompt = `Generate a high-priority admin alert: The ingredient "${item.name}" is running low (${item.stock} left). Threshold is 20.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    console.log("--- SYSTEM ALERT (SENT TO ADMIN EMAIL) ---");
    console.log(response.text);
  }
  
  res.json(item);
});

// 2. Orders
app.post('/api/orders', async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  
  // Update Stock logic
  const items = [req.body.items.base, req.body.items.sauce, req.body.items.cheese, ...req.body.items.veggies];
  for (const item of items) {
    if (item && item._id) {
      await Ingredient.findByIdAndUpdate(item._id, { $inc: { stock: -1 } });
    }
  }
  
  res.status(201).json(newOrder);
});

app.get('/api/orders', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

app.patch('/api/orders/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(order);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
