import ErrorBoundary from './components/ErrorBoundary';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import PrincipalDashboard from './pages/PrincipalDashboard';

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
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
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;

