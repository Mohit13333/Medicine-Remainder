// Navbar.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getUser } from "../services/api";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState({ role: "user" });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const fetchUsers = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await getUser(userId);
      console.log(response);
      setUsers({ role: response.data.role }); // Safely set users state as an array
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Failed to fetch users. Please try again.");
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <div className="text-white text-lg font-bold">Medicine Remainder</div>
        <button
          onClick={toggleMenu}
          className="text-white md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      <ul
        className={`md:flex md:items-center md:space-x-4 bg-gray-800 md:bg-transparent ${
          isOpen ? "block" : "hidden"
        } transition-all duration-300`}
      >
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-white font-bold px-4 py-2"
                : "text-gray-200 px-4 py-2"
            }
          >
            Medicine Schedule
          </NavLink>
        </li>
        {users.role === "admin" ? (
          <li>
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-white font-bold px-4 py-2"
                  : "text-gray-200 px-4 py-2"
              }
            >
              Admin Dashboard
            </NavLink>
          </li>
        ) : (
          ""
        )}
        <li>
          <NavLink
            to="/logs"
            className={({ isActive }) =>
              isActive
                ? "text-white font-bold px-4 py-2"
                : "text-gray-200 px-4 py-2"
            }
          >
            Logs
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/logout"
            className={({ isActive }) =>
              isActive
                ? "text-white font-bold px-4 py-2"
                : "text-gray-200 px-4 py-2"
            }
          >
            Logout
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
