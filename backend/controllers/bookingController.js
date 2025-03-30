import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    // Destructure locations from the request body along with other fields
    const { carId, startDate, endDate, pickupLocation, dropoffLocation } = req.body;

    // Convert date strings to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid date format provided." });
    }
    if (start >= end) {
      return res.status(400).json({ message: "End date must be after start date." });
    }

    // Validate required location fields (assuming they are required in the model)
    if (!pickupLocation || !dropoffLocation) {
        return res.status(400).json({ message: "Pickup and Drop-off locations are required." });
    }


    // Check if the car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found." });
    }

    // Check if the car is marked as available
    if (!car.available) {
        return res.status(400).json({ message: "Car is currently marked as unavailable." });
    }

    // Optional: Add robust date overlap check here if needed, checking against ALL bookings for the car
    // const existingOverlap = await Booking.findOne({ car: carId, $or: [...] });
    // if (existingOverlap) { return res.status(400).json({ message: "Car is already booked for some of the selected dates." }); }


    // Calculate total days and price (server-side calculation is safer)
    const diffTime = Math.abs(end - start);
    // Ensure minimum 1 day rental
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const calculatedTotalPrice = diffDays * car.pricePerDay;

    // Create a new booking instance, including the location fields
    const booking = new Booking({
      user: req.user.id, // Assumes req.user is populated by auth middleware
      car: carId,
      startDate: start,
      endDate: end,
      totalPrice: calculatedTotalPrice,
      pickupLocation: pickupLocation,   // <-- Save pickup location
      dropoffLocation: dropoffLocation, // <-- Save dropoff location
      // status: 'Confirmed' // Optional: set default status if applicable
    });

    // Save the new booking document
    await booking.save();

    // Update the car's availability status to false
    await Car.findByIdAndUpdate(carId, { available: false });
    console.log(`Car ${carId} marked as unavailable.`); // Server log

    // Send successful response
    res.status(201).json({
      message: "Booking confirmed",
      data: booking, // Return the complete booking object
    });

  } catch (error) {
    console.error("Error creating booking:", error); // Log detailed error on server
    // Handle potential validation errors from Mongoose
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: "Booking validation failed", errors: error.errors });
    }
    // Generic error response
    res.status(500).json({ message: "An error occurred while creating the booking.", error: error.message });
  }
};


// Get all bookings (Admin route)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email') // Populate user details (select specific fields)
      .populate('car', 'brand model pricePerDay image') // Populate car details (select specific fields)
      .sort({ createdAt: -1 }); // Sort by creation date, newest first
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    // Find bookings specifically for the logged-in user (req.user.id comes from auth middleware)
    const bookings = await Booking.find({ user: req.user.id })
      .populate('car', 'brand model pricePerDay image available') // Populate car details, include 'available' status if needed here
      .sort({ createdAt: -1 }); // Sort by creation date
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get a specific booking
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('car', 'brand model pricePerDay image available'); // Include details needed

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Optional: Check if the user is authorized to view this booking
    // if (booking.user._id.toString() !== req.user.id && req.user.role !== "admin") {
    //    return res.status(403).json({ success: false, message: "Not authorized to view this booking" });
    // }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error("Error fetching single booking:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    // Find the booking by the ID provided in the request parameters
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Check if the user making the request is the owner of the booking or an admin
    // (req.user should be populated by your authentication middleware)
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this booking" });
    }

    const carId = booking.car; // Get the ID of the car associated with this booking

    // Delete the booking document
    await booking.deleteOne(); // Or use findByIdAndDelete(req.params.id)

    // --- FIX: UPDATE CAR AVAILABILITY ---
    // After successfully deleting the booking, mark the car as available again.
    // NOTE: This simple logic marks the car available regardless of other potential bookings.
    // If a car can be booked by multiple people for different future dates,
    // you might need more complex logic here (e.g., check if *any* other bookings exist
    // for this car before setting available = true).
    await Car.findByIdAndUpdate(carId, { available: true });
    console.log(`Car ${carId} marked as available after booking cancellation.`); // Optional logging
    // --- END OF FIX ---

    res.status(200).json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "An error occurred while cancelling the booking.", error: error.message });
  }
};
