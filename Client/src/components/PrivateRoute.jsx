import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element: Component }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Redirect to login if not logged in
  return isLoggedIn ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
