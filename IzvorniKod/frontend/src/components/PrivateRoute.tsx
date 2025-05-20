import React, {JSX} from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface PrivateRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const token = authService.getToken();
  const isAuthorized = token && (!requiredRole || authService.isUserInRole(requiredRole));

  return isAuthorized ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

