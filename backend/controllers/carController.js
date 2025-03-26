import Car from "../models/Car.js";

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json({ success: true, data: cars });
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
      image, 
      transmission, 
      seats,
      doors,
      luggageCapacity 
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

    const car = new Car({ 
      brand, 
      model, 
      year, 
      pricePerDay, 
      available, 
      image, 
      transmission, 
      seats,
      doors,
      luggageCapacity 
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

    Object.assign(car, req.body);
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

    await car.deleteOne();
    res.status(200).json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
