import { Router } from "express";
import {
  createLog,
  getLogs,
  getLogById,
  updateLog,
  deleteLog,
  getFilteredLogs,
} from "../controllers/log.controller.js";
import { authAdmin, authUser } from "../middlewares/user.middleware.js";

export const router = Router();

router.post("/createlogs", authUser, createLog);

router.get("/getlogs", authUser, getLogs);

router.get("/getlogs/:id", authUser, getLogById);

router.put("/updatelogs/:id", authUser, updateLog);

router.delete("/updatelogs/:id", authUser, deleteLog);

router.get("/filtered",authUser,authAdmin, getFilteredLogs);