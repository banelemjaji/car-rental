import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/", protect, admin, getAllBookings);
router.get("/my", protect, getUserBookings);
router.delete("/:id", protect, cancelBooking);

export default router;
