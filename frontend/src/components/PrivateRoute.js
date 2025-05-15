// src/components/PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token'); 
  // or your own logic
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
  
};



export default PrivateRoute;
