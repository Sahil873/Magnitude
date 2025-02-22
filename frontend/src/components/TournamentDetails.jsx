import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAllotting, setIsAllotting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BACKEND_URL}/tournament/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTournament(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch tournament details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournamentDetails();
  }, [id]);

  const handleAllotPlayers = async () => {
    try {
      setIsAllotting(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${BACKEND_URL}/tournament/${id}/autoallocate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh tournament data after allotment
      const response = await axios.get(`${BACKEND_URL}/tournament/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTournament(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to allot players");
    } finally {
      setIsAllotting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this tournament?"))
      return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${BACKEND_URL}/tournament/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/organizer-dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete tournament");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading)
    return (
      <div className="text-center py-4">Loading tournament details...</div>
    );
  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;
  if (!tournament)
    return <div className="text-center py-4">Tournament not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tournament.name}
              </h1>
              <p className="text-gray-600">
                Organized by: {tournament.organizedBy}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAllotPlayers}
                disabled={isAllotting || isDeleting}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
              >
                {isAllotting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Allotting...
                  </>
                ) : (
                  "Allot Players"
                )}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting || isAllotting}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300 flex items-center"
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Tournament"
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Teams</h2>
            <div className="grid gap-4">
              {tournament.Teams?.map((team, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-medium text-gray-800">
                      {team.name}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      Score: {team.score || 0}
                    </span>
                  </div>

                  {team.players?.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-lg font-medium text-gray-700 mb-2">
                        Players
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {team.players.map((player, playerIndex) => (
                          <div
                            key={playerIndex}
                            className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm"
                          >
                            <span className="text-gray-800">
                              {player.username}
                            </span>
                            <span className="text-gray-600">
                              Score: {player.score || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;
