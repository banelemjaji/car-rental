import express from "express";
import multer from "multer";
import {
  getCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar,
} from "../controllers/carController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", getCars);
router.get("/:id", getCarById);

// admin only
router.post("/", protect, admin, upload.single("image"), addCar); // Use 'upload.single' middleware
router.put("/:id", protect, admin, upload.single("image"), updateCar); // Use 'upload.single' middleware
router.delete("/:id", protect, admin, deleteCar);

export default router;