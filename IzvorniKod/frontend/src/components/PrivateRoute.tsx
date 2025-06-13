import React, {JSX} from 'react';
import {Navigate} from 'react-router-dom';
import {authService} from '../services/authService';

interface PrivateRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({children, requiredRole}) => {
  const isLoggedIn = !!authService.getToken() && !authService.isTokenExpired();

  if (!isLoggedIn) {
    authService.logout();
    return <Navigate to="/login"/>;
  }

  if (requiredRole && !authService.isUserInRole(requiredRole)) {
    return <Navigate to="/zabranjeno"/>;
  }

  return children;
};

export default PrivateRoute;

