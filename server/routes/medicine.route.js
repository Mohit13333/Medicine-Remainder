import express from "express";
import {
  createMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicine.controller.js";
import { authUser } from "../middlewares/user.middleware.js";

export const router = express.Router();

router.post("/create", authUser, createMedicine);
router.get("/get", authUser, getMedicines);
router.put("/update/:id", updateMedicine);
router.delete("/delete/:id", deleteMedicine);
