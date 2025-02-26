import Car from "../models/Car.js";

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single car by ID
// @route   GET /api/cars/:id
// @access  Public
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add a new car (Admin only)
// @route   POST /api/cars
// @access  Private (Admin)
export const addCar = async (req, res) => {
  try {
    const { brand, model, year, pricePerDay, available, image } = req.body;
    const car = new Car({ brand, model, year, pricePerDay, available, image });

    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update car details (Admin only)
// @route   PUT /api/cars/:id
// @access  Private (Admin)
export const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    Object.assign(car, req.body);
    await car.save();

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a car (Admin only)
// @route   DELETE /api/cars/:id
// @access  Private (Admin)
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    await car.deleteOne();
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
