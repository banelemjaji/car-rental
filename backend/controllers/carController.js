import Car from "../models/Car.js";
import cloudinary from "../config/cloudinary.js";
import dotenv from "dotenv";
dotenv.config();

// Function to upload image to Cloudinary
const uploadImageToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "car_rental", // Optional folder in Cloudinary
    });
    return { url: result.secure_url, public_id: result.public_id };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
export const getCars = async (req, res) => {
  try {
    // Parse pagination query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Only select necessary fields
    const fields = 'brand model year pricePerDay available image transmission seats doors luggageCapacity';

    // Fetch paginated cars
    const cars = await Car.find()
      .select(fields)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Car.countDocuments();

    res.status(200).json({
      success: true,
      data: cars,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error fetching cars:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get single car by ID
// @route   GET /api/cars/:id
// @access  Public
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    res.status(200).json({ success: true, data: car });
  } catch (error) {
    console.error("Error fetching car by ID:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Add a new car (Admin only)
// @route   POST /api/cars
// @access  Private (Admin)
export const addCar = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const {
      brand,
      model,
      year,
      pricePerDay,
      available,
      transmission,
      seats,
      doors,
      luggageCapacity,
    } = req.body;

    // Validate required fields
    if (!brand || !model || !year || !pricePerDay || !transmission) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if car already exists
    const existingCar = await Car.findOne({ brand, model, year });
    if (existingCar) {
      return res.status(400).json({ message: "Car already exists" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image." });
    }

    const uploadedImage = await uploadImageToCloudinary(req.file.path);

    const car = new Car({
      brand,
      model,
      year,
      pricePerDay,
      available,
      image: uploadedImage.url,
      transmission,
      seats,
      doors,
      luggageCapacity,
    });

    await car.save();

    res.status(201).json({ success: true, message: "Car added successfully", data: car });
  } catch (error) {
    console.error("Error adding car:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Update car details (Admin only)
// @route   PUT /api/cars/:id
// @access  Private (Admin)
export const updateCar = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    const {
      brand,
      model,
      year,
      pricePerDay,
      available,
      transmission,
      seats,
      doors,
      luggageCapacity,
    } = req.body;

    car.brand = brand || car.brand;
    car.model = model || car.model;
    car.year = year || car.year;
    car.pricePerDay = pricePerDay || car.pricePerDay;
    car.available = available || car.available;
    car.transmission = transmission || car.transmission;
    car.seats = seats || car.seats;
    car.doors = doors || car.doors;
    car.luggageCapacity = luggageCapacity || car.luggageCapacity;

    if (req.file) {
      try {
        const uploadedImage = await uploadImageToCloudinary(req.file.path);
        car.image = uploadedImage.url;
      } catch (error) {
        return res.status(500).json({ message: "Failed to update image." });
      }
    }

    await car.save();

    res.status(200).json({ success: true, message: "Car updated successfully", data: car });
  } catch (error) {
    console.error("Error updating car:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Delete a car (Admin only)
// @route   DELETE /api/cars/:id
// @access  Private (Admin)
export const deleteCar = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    try {
      // Extract public_id from Cloudinary URL and delete the image
      const publicId = car.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`car_rental/${publicId}`);
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error);
    }

    await car.deleteOne();
    res.status(200).json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};