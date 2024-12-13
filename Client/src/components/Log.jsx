import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogs } from "../slices/logSlice";
import {
  createLog,
  getAcknowledgmentLogs,
  updateLog,
  deleteLog,
  getLogById,
  getFilteredLogs,
  getUser, // Assuming there's an API to get users
  getMedicines, // Assuming there's an API to get medicines
} from "../services/api";

const Log = () => {
  const dispatch = useDispatch();
  const logs = useSelector((state) => state.logs.acknowledgmentLogs);
  const [status, setStatus] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
//   const [filter, setFilter] = useState({
//     userId: "",
//     startDate: "",
//     endDate: "",
//   });
  const [selectedUser, setSelectedUser] = useState(""); // New state for selected user
  const [selectedMedicine, setSelectedMedicine] = useState(""); // New state for selected medicine
  const [users, setUsers] = useState({ userId: "",name:"" }); // State to hold users
  const [medicines, setMedicines] = useState([]); // State to hold medicines
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await getAcknowledgmentLogs();
        console.log(response);
        dispatch(setLogs(response.data));
      } catch (error) {
        console.error("Error fetching logs:", error);
        setErrorMessage("Failed to fetch logs. Please try again.");
      }
    };

    const fetchUsers = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await getUser(userId);
        setUsers({ userId: response.data._id,name:response.data.name }); // Safely set users state as an array
      } catch (error) {
        console.error("Error fetching users:", error);
        setErrorMessage("Failed to fetch users. Please try again.");
      }
    };

    const fetchMedicines = async () => {
      try {
        const response = await getMedicines(); // Fetch medicines from API
        setMedicines(response.data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
        setErrorMessage("Failed to fetch medicines. Please try again.");
      }
    };

    fetchLogs();
    fetchUsers();
    fetchMedicines();
  }, [dispatch]);

  const handleCreateLog = async () => {
    if (!status || !selectedUser || !selectedMedicine) {
      setErrorMessage(
        "Status, User ID, and Medicine ID are required to create a log."
      );
      return;
    }

    try {
      const logData = {
        status,
        userId: selectedUser,
        medicineId: selectedMedicine,
      };
      await createLog(logData);
      setStatus("");
      setSelectedUser("");
      setSelectedMedicine("");
      setErrorMessage("");
      const response = await getAcknowledgmentLogs();
      dispatch(setLogs(response.data));
    } catch (error) {
      console.error("Error creating log:", error);
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
      console.error("Error updating log:", error);
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
      console.error("Error deleting log:", error);
      setErrorMessage("Failed to delete log. Please try again.");
    }
  };
  const handleFetchLogById = async (id) => {
    try {
      const log = await getLogById(id);
      console.log(log);
      setSelectedLog(log.data);
      setStatus(log.data.status);
      setSelectedUser(log.data.userId); // Set selected user for editing
      setSelectedMedicine(log.data.medicineId); // Set selected medicine for editing
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching log by ID:", error);
      setErrorMessage("Failed to fetch log details. Please try again.");
    }
  };

//   const handleFilterLogs = async () => {
//     try {
//       const response = await getFilteredLogs(filter);
//       dispatch(setLogs(response.data));
//       setErrorMessage("");
//     } catch (error) {
//       console.error("Error fetching filtered logs:", error);
//       setErrorMessage("Failed to filter logs. Please try again.");
//     }
//   };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Acknowledgment Logs</h2>
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <div className="flex items-center mb-4">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="border rounded py-2 px-3 mr-2 w-full"
        >
          <option value="">Select User</option>
          {/* {users.map(user => ( */}
          <option value={users.userId}>{users.name}</option> // Assuming user has a name property
          {/* ))} */}
        </select>

        <select
          value={selectedMedicine}
          onChange={(e) => setSelectedMedicine(e.target.value)}
          className="border rounded py-2 px-3 mr-2 w-full"
        >
          <option value="">Select Medicine</option>
          {medicines.map((medicine) => (
            <option key={medicine._id} value={medicine._id}>
              {medicine.name}
            </option> // Assuming medicine has a name property
          ))}
        </select>

        <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded py-2 px-3 mb-2 w-full"
          >
            <option value="">Select Acknowelged status</option>
            <option>acknowledged</option>
            <option>missed</option>
          </select>

        <button
          onClick={handleCreateLog}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Create Log
        </button>
      </div>

      {/* <h3 className="text-lg font-semibold mb-2">Filter Logs</h3>
      <div className="flex flex-col mb-4">
        <input
          type="text"
          placeholder="User ID"
          value={filter.userId}
          onChange={(e) => setFilter({ ...filter, userId: e.target.value })}
          className="border rounded py-2 px-3 mb-2"
        />
        <div className="flex space-x-2 mb-2">
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) =>
              setFilter({ ...filter, startDate: e.target.value })
            }
            className="border rounded py-2 px-3"
          />
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            className="border rounded py-2 px-3"
          />
        </div>
        <button
          onClick={handleFilterLogs}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Filter Logs
        </button>
      </div> */}

      <ul className="border-t border-gray-300">
        {logs.map((log) => (
          <li
            key={log._id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{log.status}</span>
            <div>
              <button
                onClick={() => handleFetchLogById(log._id)}
                className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteLog(log._id)}
                className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedLog && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">
            Editing Log: {selectedLog._id}
          </h3>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border rounded py-2 px-3 mb-2 w-full"
          >
            <option value="">Select User</option>
            {/* {users.map((user) => ( */}
              <option key={users._id} value={users._id}>
                {users.name}
              </option>
            {/* ))} */}
          </select>

          <select
            value={selectedMedicine}
            onChange={(e) => setSelectedMedicine(e.target.value)}
            className="border rounded py-2 px-3 mb-2 w-full"
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
            className="border rounded py-2 px-3 mb-2 w-full"
          >
            <option value="">Select Acknowelged status</option>
            <option>acknowledged</option>
            <option>missed</option>
          </select>
          <button
            onClick={() => handleUpdateLog(selectedLog._id)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Update Log
          </button>
        </div>
      )}
    </div>
  );
};

export default Log;
