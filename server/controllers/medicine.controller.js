import Medicine from "../models/medicine.model.js";

// Create a new medicine
// Create a new medicine
export const createMedicine = async (req, res) => {
  try {
    console.log("User ID from request:", req.user.id); // Debugging line
    const medicine = new Medicine({ ...req.body, userId: req.user.id });
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    console.error("Error creating medicine:", error); // Log the error for debugging
    res.status(400).json({ error: "Error creating medicine" });
  }
};


// Get all medicines for the authenticated user
export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user.id });
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a medicine by ID
export const updateMedicine = async (req, res) => {
  const { id } = req.params;
  try {
    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    // Check if the user is authorized to update this medicine
    if (medicine.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this medicine" });
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "Medicine updated successfully", medicine: updatedMedicine });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a medicine by ID
export const deleteMedicine = async (req, res) => {
  const { id } = req.params;
  try {
    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    // Check if the user is authorized to delete this medicine
    if (medicine.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this medicine" });
    }

    await Medicine.findByIdAndDelete(id);
    res.status(200).json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
