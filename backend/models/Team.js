const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    tournamentId: { type: String, required: true, ref: 'Tournament' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model("Team", teamSchema);
  