// New component: src/components/PrivateRoute.tsx
// This component protects routes by checking authentication status.
// If not authenticated, it redirects to the login page.
// It uses Outlet for nested routes.
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '@/store'; // Assuming you have a RootState type exported from your store

const PrivateRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;