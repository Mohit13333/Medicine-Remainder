import { Router } from "express";
import { adminPanel, getFilteredLogs } from "../controllers/admin.controller.js";
import { authAdmin, authUser } from "../middlewares/user.middleware.js";
const router=Router();

router.get("/",authUser,authAdmin,adminPanel)
router.get("/filtered",authUser,authAdmin, getFilteredLogs);

export {router};