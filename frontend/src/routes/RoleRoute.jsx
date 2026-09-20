import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStoredUser } from '../services/auth';

const rolePaths = {
  student: '/student-dashboard',
  teacher: '/teacher-dashboard',
  principal: '/principal-dashboard',
};

export default function RoleRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  const currentUser = user || getStoredUser();

  if (!isAuthenticated && !currentUser) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(currentUser?.role)) {
    const redirect = rolePaths[currentUser?.role] || '/login';
    return <Navigate to={redirect} replace />;
  }

  return children;
}
