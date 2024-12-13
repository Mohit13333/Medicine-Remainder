import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogs } from "../slices/logSlice";
import {
  createLog,
  getAcknowledgmentLogs,
  updateLog,
  deleteLog,
  getLogById,
  getUser,
  getMedicines,
} from "../services/api";
import Navbar from "./NavBar";

const Log = () => {
  const dispatch = useDispatch();
  const logs = useSelector((state) => state.logs.acknowledgmentLogs);
  const [status, setStatus] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [users, setUsers] = useState({ userId: "", name: "" });
  const [medicines, setMedicines] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await getAcknowledgmentLogs();
        dispatch(setLogs(response.data));
      } catch (error) {
        setErrorMessage("Failed to fetch logs. Please try again.");
      }
    };

    const fetchUsers = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await getUser(userId);
        setUsers({ userId: response.data._id, name: response.data.name });
        setSelectedUser(response.data._id);
      } catch (error) {
        setErrorMessage("Failed to fetch users. Please try again.");
      }
    };

    const fetchMedicines = async () => {
      try {
        const response = await getMedicines();
        setMedicines(response.data);
      } catch (error) {
        setErrorMessage("Failed to fetch medicines. Please try again.");
      }
    };

    fetchLogs();
    fetchUsers();
    fetchMedicines();
  }, [dispatch]);

  const handleCreateLog = async () => {
    const finalStatus = status || "taken";
    if (!selectedMedicine) {
      setErrorMessage("Medicine ID is required to create a log.");
      return;
    }

    try {
      const logData = {
        status: finalStatus,
        userId: users.userId,
        medicineId: selectedMedicine,
      };
      await createLog(logData);
      setStatus("");
      setSelectedMedicine("");
      setErrorMessage("");
      const response = await getAcknowledgmentLogs();
    //   console.log(response);
      dispatch(setLogs(response.data));
    } catch (error) {
      setErrorMessage("Failed to create log. Please try again.");
    }
  };

  const handleUpdateLog = async (id) => {
    if (!status) {
      setErrorMessage("Status is required to update the log.");
      return;
    }

    try {
      await updateLog(id, { status });
      setSelectedLog(null);
      setStatus("");
      setErrorMessage("");
      const response = await getAcknowledgmentLogs();
      dispatch(setLogs(response.data));
    } catch (error) {
      setErrorMessage("Failed to update log. Please try again.");
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await deleteLog(id);
      const response = await getAcknowledgmentLogs();
      dispatch(setLogs(response.data));
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to delete log. Please try again.");
    }
  };

  const handleFetchLogById = async (id) => {
    try {
      const log = await getLogById(id);
      setSelectedLog(log.data);
      setStatus(log.data.status);
      setSelectedMedicine(log.data.medicineId._id);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to fetch log details. Please try again.");
    }
  };
  return (
    <>
      <Navbar />
      <div className="container mt-14 mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Medicine Logs</h2>
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}
        {!selectedLog && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4">
            <select
              value={users.userId}
              disabled
              className="border rounded py-2 px-2 bg-gray-100 cursor-not-allowed"
            >
              <option value="">{users.name}</option>
            </select>

            <select
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(e.target.value)}
              className="border rounded py-2 px-2"
            >
              <option value="">Select Medicine</option>
              {medicines.map((medicine) => (
                <option key={medicine._id} value={medicine._id}>
                  {medicine.name}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded py-2 px-2"
            >
              <option value="">Select Acknowledged Status (Optional)</option>
              <option value="taken">Taken</option>
              <option value="missed">Missed</option>
            </select>

            <button
              onClick={handleCreateLog}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Create Log
            </button>
          </div>
        )}
        {selectedLog && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <h3 className="text-lg font-semibold mb-2">
              Medicine id: {selectedLog._id}
            </h3>
            <select
              value={users.userId}
              disabled
              className="border rounded py-2 px-3 mb-2 w-full bg-gray-100 cursor-not-allowed"
            >
              <option value="">{users.name}</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded py-2 px-3 mb-2 w-full"
            >
              <option value="">Select Acknowledged Status</option>
              <option value="taken">Taken</option>
              <option value="missed">Missed</option>
            </select>
            <button
              onClick={() => handleUpdateLog(selectedLog._id)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Update Log
            </button>
          </div>
        )}

        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-2">
                Medicine Name
              </th>
              <th className="border border-gray-300 px-2 py-2">Dosage</th>
              <th className="border border-gray-300 px-2 py-2">Status</th>
              <th className="border border-gray-300 px-2 py-2">Timestamp</th>
              <th className="border border-gray-300 px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b border-gray-200">
                <td className="border border-gray-300 px-2 py-2">
                  {log?.medicineId?.name}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {log?.medicineId?.dosage}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {log.status}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <button
                    onClick={() => handleFetchLogById(log._id)}
                    className="bg-green-500 m-2 text-white py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLog(log._id)}
                    className="bg-blue-500 m-2 text-white py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Log;
