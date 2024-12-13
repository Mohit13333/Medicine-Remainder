import { createSlice } from '@reduxjs/toolkit';

const medicineSlice = createSlice({
  name: 'medicine',
  initialState: {
    medicines: [],
  },
  reducers: {
    setMedicines: (state, action) => {
      state.medicines = action.payload;
    },
    addMedicine: (state, action) => {
      state.medicines.push(action.payload);
    },
  },
});

export const { setMedicines, addMedicine } = medicineSlice.actions;
export default medicineSlice.reducer;
