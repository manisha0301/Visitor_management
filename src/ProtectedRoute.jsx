// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
