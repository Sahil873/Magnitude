const mongoose = require("mongoose");
const playerSchema = new mongoose.Schema({
    id: { type: String, default: () => new mongoose.Types.UUID(), unique: true },
    username: { type: String, required: true, ref: 'User' },
    teamId: { type: String, ref: 'Team', default: null },
    // tournamentId: { type: String, ref: 'Tournament' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Player", playerSchema);
