import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;

    // Convert dates to standard format
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if the end date is after the start date
    if (start >= end) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    // Check if the car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Check if the car is available for the selected dates
    const existingBooking = await Booking.findOne({
      car: carId,
      user: req.user.id,
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } } // Check for overlapping dates
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: "You have already booked this car for the selected dates." });
    }

    // Create a new booking
    const booking = new Booking({
      user: req.user.id, // Logged-in user
      car: carId,
      startDate: start,
      endDate: end,
      totalPrice: car.pricePerDay * ((end - start) / (1000 * 60 * 60 * 24)), // Calculate total price
    });

    await booking.save();
    res.status(201).json({
      message: "Booking confirmed",
      data: booking,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings (Admin route)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('car', 'brand model pricePerDay')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('car', 'brand model pricePerDay')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific booking
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('car', 'brand model pricePerDay');

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the user is authorized to cancel this booking
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    await booking.deleteOne();
    res.status(200).json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
