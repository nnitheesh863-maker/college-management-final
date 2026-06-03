import ErrorBoundary from './components/ErrorBoundary';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import PrincipalDashboard from './pages/PrincipalDashboard';
import ParentDashboard from './pages/ParentDashboard';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student-dashboard" element={
          <PrivateRoute><RoleRoute allowedRoles={['student']}><StudentDashboard /></RoleRoute></PrivateRoute>
        } />
        <Route path="/teacher-dashboard" element={
          <PrivateRoute><RoleRoute allowedRoles={['teacher']}><TeacherDashboard /></RoleRoute></PrivateRoute>
        } />
        <Route path="/principal-dashboard" element={
          <PrivateRoute><RoleRoute allowedRoles={['principal']}><PrincipalDashboard /></RoleRoute></PrivateRoute>
        } />
        <Route path="/parent-dashboard" element={
          <PrivateRoute><RoleRoute allowedRoles={['parent']}><ParentDashboard /></RoleRoute></PrivateRoute>
        } />
        <Route path="*" element={<Login />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <NotificationProvider>
          <AnimatedRoutes />
        </NotificationProvider>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
