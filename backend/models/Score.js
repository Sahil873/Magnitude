const mongoose = require("mongoose");
const scoreSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    matchId: { type: String, required: true, ref: 'Match' },
    teamId: { type: String, required: true, ref: 'Team' },
    points: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model("Score", scoreSchema);