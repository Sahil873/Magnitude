const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    tournamentId: { type: String, required: true, ref: 'Tournament' },
    teamAId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    teamBId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    refereeId: { type: String, ref: 'User' },
    // scheduledTime: { type: Date, required: true },
    status: { type: String, enum: ['SCHEDULED', 'ONGOING', 'COMPLETED'], default: 'SCHEDULED' },
    // scoreTeamA: { type: Number, default: 0 },
    // scoreTeamB: { type: Number, default: 0 },
    // createdAt: { type: Date, default: Date.now },
    // updatedAt: { type: Date, default: Date.now },
    winner: { type: String, ref: 'Team' }
  });

module.exports = mongoose.model("Match", matchSchema);