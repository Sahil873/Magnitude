import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    numberOfTeams: 0,
    teams: [],
  });

  // Role-based access control and data fetching
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Check authentication
        // if (!token) {
        //   navigate("/login");
        //   return;
        // }

        // Fetch tournaments if authenticated
        const response = await axios.get(`${BACKEND_URL}/tournaments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTournaments(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  const handleNumberOfTeamsChange = (e) => {
    const num = parseInt(e.target.value) || 0;
    setFormData({
      ...formData,
      numberOfTeams: num,
      teams: Array(num).fill({ name: "", score: 0, players: [] }),
    });
  };

  const handleTeamNameChange = (index, value) => {
    const updatedTeams = [...formData.teams];
    updatedTeams[index] = { name: value, score: 0, players: [] };
    setFormData({
      ...formData,
      teams: updatedTeams,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BACKEND_URL}/tournaments`,
        {
          name: formData.name,
          teams: formData.teams,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Add new tournament to state
      setTournaments([...tournaments, response.data]);
      setShowModal(false);
      // Reset form
      setFormData({
        name: "",
        numberOfTeams: 0,
        teams: [],
      });
    } catch (error) {
      console.error("Error creating tournament:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Organizer Dashboard
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Tournament
            </button>
          </div>

          {/* Tournaments List */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Your Tournaments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournaments.map((tournament) => (
                <div
                  key={tournament._id}
                  className="bg-white p-4 rounded-lg shadow border"
                >
                  <h3 className="font-bold text-lg">{tournament.name}</h3>
                  <p className="text-gray-600">
                    Teams: {tournament.teams.length}
                  </p>
                  <div className="mt-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create Tournament Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create Tournament</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Tournament Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Number of Teams
                    </label>
                    <input
                      type="number"
                      min="2"
                      value={formData.numberOfTeams}
                      onChange={handleNumberOfTeamsChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  {formData.teams.map((team, index) => (
                    <div key={index} className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Team {index + 1} Name
                      </label>
                      <input
                        type="text"
                        value={team.name}
                        onChange={(e) =>
                          handleTeamNameChange(index, e.target.value)
                        }
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                    </div>
                  ))}

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Create Tournament
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
