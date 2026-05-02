import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("accounts/login/", form);

      console.log("LOGIN RESPONSE:", res.data);

      const token = res.data.access || res.data.token;

      if (!token) {
        alert("Token not received from backend!");
        return;
      }

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("role", res.data.role);

      navigate("/dashboard");

    } catch (err) {
      console.log(err.response?.data);
      alert("Login failed! Check username/password");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-6">Sign in to your account</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Enter your username"
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Enter your password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <div className="text-right">
            <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-6"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account? <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">Register</a>
        </p>
      </form>
    </div>
  );
}