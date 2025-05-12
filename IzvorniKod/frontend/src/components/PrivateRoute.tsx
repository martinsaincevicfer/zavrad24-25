import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = !!authService.getToken();
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};