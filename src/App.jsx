import { Routes, Route } from "react-router-dom";
import TeacherDashboard from "./TeacherDashboard";
import PingTest from "./PingTest";
import StudentForm from "./StudentForm";
import LoginForm from "./LoginForm"; // create this component for login page

function App() {
  return (
    <Routes>
      <Route path="/register" element={<StudentForm />} />
      <Route path="/ping-test" element={<PingTest />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/dashboard" element={<TeacherDashboard />} />
      <Route path="*" element={<StudentForm />} /> {/* default route */}
    </Routes>
  );
}

export default App;