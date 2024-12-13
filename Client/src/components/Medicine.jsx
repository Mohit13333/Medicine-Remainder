import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMedicine, getMedicines } from '../services/api';
import { setMedicines, addMedicine } from '../slices/medicineSlice';
import Navbar from './NavBar';

const MedicineSchedule = () => {
  const dispatch = useDispatch();
  const medicines = useSelector((state) => state.medicine.medicines);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await getMedicines();
        dispatch(setMedicines(response.data)); 
      } catch (error) {
        console.error('Failed to fetch medicines:', error);
      }
    };

    fetchMedicines();
  }, [dispatch]);

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const schedule = scheduleTime.split(',').map((time) => new Date(time.trim())); 
      const newMedicine = { name, dosage, scheduleTime: schedule };
      const response = await createMedicine(newMedicine);
      dispatch(addMedicine(response.data));
      setName('');
      setDosage('');
      setScheduleTime('');
    } catch (error) {
      console.error('Failed to add medicine:', error);
      setError(error.response?.data?.message || 'Failed to add medicine. Please try again.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
        <Navbar/>
      <h2 className="text-2xl font-bold mb-4">Medicine Schedule</h2>
      <form onSubmit={handleAddMedicine} className="mb-4">
        <input
          type="text"
          placeholder="Medicine Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded py-2 px-3 mr-2"
          required
        />
        <input
          type="text"
          placeholder="Dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          className="border rounded py-2 px-3 mr-2"
          required
        />
        <input
          type="Date"
          placeholder="Schedule Time"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
          className="border rounded py-2 px-3 mr-2"
          required
        />
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
          Add Medicine
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Medicine Name</th>
            <th className="border border-gray-300 p-2">Dosage</th>
            <th className="border border-gray-300 p-2">Schedule Time</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => (
            <tr key={medicine._id}>
              <td className="border border-gray-300 p-2">{medicine.name}</td>
              <td className="border border-gray-300 p-2">{medicine.dosage}</td>
              <td className="border border-gray-300 p-2">
                {medicine.scheduleTime.map((time, index) => (
                  <div key={index}>{new Date(time).toLocaleString()}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicineSchedule;
