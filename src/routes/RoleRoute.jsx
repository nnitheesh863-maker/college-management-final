import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const rolePaths = {
  student: '/student-dashboard',
  teacher: '/teacher-dashboard',
  principal: '/principal-dashboard',
};

export default function RoleRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.role)) {
    const redirect = rolePaths[user?.role] || '/login';
    return <Navigate to={redirect} replace />;
  }

  return children;
}
