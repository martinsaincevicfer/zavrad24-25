import React, {JSX} from 'react';
import {Navigate} from 'react-router-dom';
import {authService} from '../services/authService';

interface PrivateRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({children, requiredRole}) => {
  if (!authService.getToken() || authService.isTokenExpired() || (requiredRole && !authService.isUserInRole(requiredRole))) {
    authService.logout();
    return <Navigate to="/login"/>;
  }

  return children;
};

export default PrivateRoute;

