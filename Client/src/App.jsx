import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./components/AdminDashboard";
import MedicineSchedule from "./components/Medicine";
import Logout from "./components/Logout";
import Log from "./components/Log";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/logs" element={<Log />} />
        <Route path="/" element={<PrivateRoute element={MedicineSchedule} />} />
        <Route
          path="/admin-dashboard"
          element={<PrivateRoute element={AdminDashboard} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
