import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PlayerDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role?.toLowerCase() !== "player") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Player Dashboard
          </h1>
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <p className="text-green-700">Welcome, Player!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-bold mb-2">My Tournaments</h2>
              <p className="text-gray-600">View your registered tournaments</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-bold mb-2">Match History</h2>
              <p className="text-gray-600">View your match history</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-bold mb-2">Upcoming Matches</h2>
              <p className="text-gray-600">Check your upcoming matches</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;
