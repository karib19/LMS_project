import { useState } from "react";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "student"
  });

  const handleRegister = async () => {
    try {
      const res = await API.post("accounts/register/", form);
      console.log(res.data);

      alert("Registered successfully");
      window.location.href = "/login";

    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data);
      alert("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Create Account</h2>
        <p className="text-center text-gray-500 mb-6">Join our learning platform today</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Enter your username"
              onChange={e => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Enter your email"
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Enter your password"
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white"
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option value="">Select a role</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            onClick={handleRegister}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-6"
          >
            Register
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account? <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">Login</a>
        </p>
      </div>
    </div>
  );
}