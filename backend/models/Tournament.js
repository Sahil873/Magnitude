const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
    // id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    // startDate: { type: Date, required: true },
    // endDate: { type: Date, required: true },
    // location: { type: String, required: true },
    organizerId: { type: String, required: true, ref: 'User' },
    Teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    schedule: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Match" }
    ]
  });

module.exports = mongoose.model("Tournament", tournamentSchema);
