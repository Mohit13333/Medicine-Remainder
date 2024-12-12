import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Registration data:", { name, email, password });
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: process.env.EXPIRY_ACCESS_TOKEN,
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
      expiresIn: process.env.EXPIRY_REFRESH_TOKEN,
    });
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("access_token", accessToken, cookiesOption);
    res.cookie("refresh_token", refreshToken, cookiesOption);
    res.json({message:"Login successfull", accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const { token } = req.body;
  try {
    if (!token) {
      return res.status(401).json({ message: "Refresh token is required" });
    }
    jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN, {
        expiresIn: process.env.EXPIRY_ACCESS_TOKEN,
      });

      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const logout = (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
