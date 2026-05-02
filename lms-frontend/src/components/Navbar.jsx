import { Link } from "react-router-dom";

export default function Navbar() {
  const role = localStorage.getItem("role");

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-white hover:text-indigo-200 transition">
          LMS
        </Link>

        <div className="flex gap-8 items-center">
          <Link
            to="/dashboard"
            className="text-white hover:text-indigo-200 transition duration-200 font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/courses"
            className="text-white hover:text-indigo-200 transition duration-200 font-medium"
          >
            Courses
          </Link>
          <Link
            to="/profile"
            className="text-white hover:text-indigo-200 transition duration-200 font-medium"
          >
            Profile
          </Link>

          {role === "instructor" && (
            <Link
              to="/add-course"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200 font-medium"
            >
              Add Course
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}