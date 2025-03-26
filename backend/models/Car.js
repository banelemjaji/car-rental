import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    available: { type: Boolean, default: true },
    image: { type: String, default: "default-car.jpg" }, // Car image URL
    transmission: { type: String, enum: ["Manual", "Automatic"], required: true },
    seats: { type: Number, default: 5 },
    doors: { type: Number, default: 4 },
    luggageCapacity: { type: Number, default: 3 }, // Number of bags
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
export default Car;
