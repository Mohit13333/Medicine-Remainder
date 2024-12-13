// Logout.js
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "../slices/userSlice"; // Adjust the import path based on your file structure
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Dispatch the clearUser action to log out
    dispatch(clearUser());
    navigate("/login"); // Redirect to login page after logging out
  }, [dispatch, navigate]);

  return null; // No need to render anything for logout
};

export default Logout;
