import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    available: { type: Boolean, default: true },
    image: { type: String, default: "default-car.jpg" }, // Car image URL
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
export default Car;
