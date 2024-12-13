import Router from "express";
import { register, login, refreshToken, logout, getUser } from "../controllers/user.controller.js";
import { authUser } from "../middlewares/user.middleware.js";

export const router = Router();

router.post("/register",register);

router.post("/login", login);

router.post("/refresh-token", refreshToken);

router.post("/logout",authUser, logout);

router.get('/getuser/:id',authUser, getUser);

