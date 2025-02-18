import express, { json } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Car from "./models/Car.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to database
connectDB();

// Basic route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

// Route to add a user
app.post("/add-user", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add a car
app.post("/add-car", async (req, res) => {
  try {
    const { name, model, price, image, available } = req.body;
    const car = new Car({ name, model, price, image, available });
    await car.save();
    res.status(201).json({ message: "Car created successfully", car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});