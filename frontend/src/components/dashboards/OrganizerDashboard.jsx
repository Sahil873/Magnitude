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
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Role-based access control and data fetching
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${BACKEND_URL}/tournaments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTournaments(response.data);
        setError(null);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch tournaments"
        );
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
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
      // Validate team names are not empty
      if (formData.teams.some((team) => !team.name.trim())) {
        throw new Error("All team names are required");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

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
      setError(error.message || "Failed to create tournament");
      console.error("Error creating tournament:", error);
    }
  };

  const handleViewDetails = (tournamentId) => {
    navigate(`/${BACKEND_URL}/tournaments/${tournamentId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Show error message if exists */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Organizer Dashboard
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              Create Tournament
            </button>
          </div>

          {/* Show loading state */}
          {isLoading ? (
            <div className="text-center py-4">Loading tournaments...</div>
          ) : (
            /* Tournaments List */
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Your Tournaments</h2>
              {tournaments.length === 0 ? (
                <p className="text-gray-500">No tournaments created yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tournaments.map((tournament) => (
                    <div
                      key={tournament._id}
                      className="bg-white p-4 rounded-lg shadow border hover:shadow-lg transition-shadow"
                    >
                      <h3 className="font-bold text-lg">{tournament.name}</h3>
                      <p className="text-gray-600">
                        Teams: {tournament.Teams?.length || 0}
                      </p>
                      <div className="mt-4">
                        <button
                          onClick={() => handleViewDetails(tournament._id)}
                          className="text-blue-500 hover:text-blue-700 font-medium"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
