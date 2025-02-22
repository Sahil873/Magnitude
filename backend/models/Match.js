const mongoose = require("mongoose");
const matchSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    tournamentId: { type: String, required: true, ref: 'Tournament' },
    teamAId: { type: String, required: true, ref: 'Team' },
    teamBId: { type: String, required: true, ref: 'Team' },
    refereeId: { type: String, required: true, ref: 'User' },
    scheduledTime: { type: Date, required: true },
    status: { type: String, enum: ['SCHEDULED', 'ONGOING', 'COMPLETED'], default: 'SCHEDULED' },
    scoreTeamA: { type: Number, default: 0 },
    scoreTeamB: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

module.exports = mongoose.model("Match", matchSchema);