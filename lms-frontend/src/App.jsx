import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Courses from "./pages/Courses/Courses";
import CourseDetail from "./pages/Courses/CourseDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import Navbar from "./components/Navbar";
import AddCourse from "./pages/Courses/AddCourse";
import ForgotPassword from "./pages/Profile/ForgotPassword";
import ResetPassword from "./pages/Profile/ResetPassword";



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
              <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
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
              <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
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
              <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
                <Navbar />
                <Courses />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
                <Navbar />
                <CourseDetail />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
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
              <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
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