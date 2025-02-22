import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RefereeDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role?.toLowerCase() !== "referee") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Referee Dashboard
          </h1>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-4">
            <p className="text-purple-700">Welcome, Referee!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-bold mb-2">Assigned Matches</h2>
              <p className="text-gray-600">View your assigned matches</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-bold mb-2">Match Reports</h2>
              <p className="text-gray-600">Submit match reports</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-bold mb-2">Schedule</h2>
              <p className="text-gray-600">View your officiating schedule</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefereeDashboard;
