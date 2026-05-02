import { useState } from "react";
import API from "../api";

export default function ResetPassword() {
  const [form, setForm] = useState({
    user_id: "",
    password: ""
  });

  const submit = async () => {
    await API.post("accounts/reset-password/", form);
    alert("Password Updated");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Reset Password</h2>
        <p className="text-center text-gray-500 mb-6">Enter your User ID and new password</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Enter your user ID"
              onChange={(e) =>
                setForm({ ...form, user_id: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Enter your new password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button
            onClick={submit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-6"
          >
            Reset Password
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">Back to Login</a>
        </p>
      </div>
    </div>
  );
}