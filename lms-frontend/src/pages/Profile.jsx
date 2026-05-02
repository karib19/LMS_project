import { useEffect, useState } from "react";
import API from "../api";

export default function Profile() {
  const [user, setUser] = useState({
    username: "",
    email: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get("accounts/profile/", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUser(res.data));
  }, []);

  const updateProfile = async () => {
    const token = localStorage.getItem("token");

    await API.put("accounts/profile/update/", user, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Profile Updated");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-gray-50"
                value={user.username || ""}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-gray-50"
                value={user.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>

            <button
              onClick={updateProfile}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 mt-8"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}