import { useEffect, useState } from "react";
import API from "../api";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get("courses/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => setCourses(res.data));
  }, []);

  const enroll = async (id) => {
    const token = localStorage.getItem("token");

    await API.post(
      "enroll/",
      { course: id },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Enrolled!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Courses</h1>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(c => (
              <div
                key={c.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden flex flex-col"
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-white opacity-80"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 110-2V4zm3 1h6v2H7V5zm0 3h6v2H7V8z" />
                  </svg>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{c.title}</h3>

                  {c.description && (
                    <p className="text-gray-600 text-sm mb-4 flex-grow">
                      {c.description.length > 100
                        ? c.description.substring(0, 100) + "..."
                        : c.description}
                    </p>
                  )}

                  <button
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-auto"
                    onClick={() => enroll(c.id)}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m0 0h6m0-6H6m0 6H0"
              />
            </svg>
            <p className="text-gray-500 text-lg">No courses available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}