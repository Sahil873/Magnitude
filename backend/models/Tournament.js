const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
    // id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
    organizerId: { type: String, required: true, ref: 'User' },
    Teams: [],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

module.exports = mongoose.model("Tournament", tournamentSchema);
