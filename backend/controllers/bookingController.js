import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private (User)
export const createBooking = async (req, res) => {
  const { carId, startDate, endDate } = req.body;
  const userId = req.user._id;

  try {
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    // Check if the car is already booked during the selected period
    const existingBooking = await Booking.findOne({
      car: carId,
      startDate: { $lt: new Date(endDate) },
      endDate: { $gt: new Date(startDate) },
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Car is already booked for these dates" });
    }

    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.pricePerDay;

    const booking = new Booking({
      user: userId,
      car: carId,
      startDate,
      endDate,
      totalPrice,
      status: "pending",
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private (Admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "name email").populate("car", "brand model");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private (User)
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("car", "brand model");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private (User/Admin)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role !== "admin" && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
