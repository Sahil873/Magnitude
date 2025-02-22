import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./components/Register";
import RegisterToast from "./components/RegisterToaster";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrganizerDashboard from "./components/dashboards/OrganizerDashboard";
import PlayerDashboard from "./components/dashboards/PlayerDashboard";
import RefereeDashboard from "./components/dashboards/RefereeDashboard";
import TournamentDetails from './components/TournamentDetails';

export default function App() {
  return (
    <>
      <RegisterToast />
      <Router>
        <ToastContainer position="top-right" />
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
          <Route path="/player-dashboard" element={<PlayerDashboard />} />
          <Route path="/referee-dashboard" element={<RefereeDashboard />} />
          <Route path="/tournaments/:id" element={<TournamentDetails />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}
