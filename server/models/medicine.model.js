import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  scheduleTime: [{ type: Date, required: true }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Medicine = mongoose.model("Medicine", medicineSchema);
export default Medicine;