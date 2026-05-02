import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import AddCourse from "./pages/AddCourse";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <Navbar />
                <Dashboard />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <Navbar />
                <Dashboard />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <Navbar />
                <Courses />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <Navbar />
                <Profile />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-course"
          element={
            <ProtectedRoute role="instructor">
              <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <Navbar />
                <AddCourse />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;