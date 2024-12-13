import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAcknowledgmentLogs, getFilteredLogs } from "../services/api";
import { setLogs } from "../slices/logSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const logs = useSelector((state) => state.logs.acknowledgmentLogs);
  const [filter, setFilter] = useState({
    userId: "",
    startDate: "",
    endDate: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await getAcknowledgmentLogs();
        dispatch(setLogs(response.data)); // Set logs in Redux state
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };

    fetchLogs();
  }, [dispatch]);

  const handleFilterLogs = async () => {
    try {
      const response = await getFilteredLogs(filter);
      dispatch(setLogs(response.data));
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching filtered logs:", error);
      setErrorMessage("Failed to filter logs. Please try again.");
    }
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Acknowledgment Logs</h2>
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Log ID</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="border border-gray-300 p-2">{log.id}</td>
              <td className="border border-gray-300 p-2">{log.status}</td>
              <td className="border border-gray-300 p-2">
                {new Date(log.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-lg font-semibold mb-2">Filter Logs</h3>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
