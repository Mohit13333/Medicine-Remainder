import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/connectDB.js";
import {router as authRouter} from "./routes/user.route.js"
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.get('/',(req, res) => {
    res.send("Welcome")
})
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("database connection failed", err);
  });