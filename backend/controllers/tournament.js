const express = require("express");
const Tournament = require("../models/Tournament"); // Import Tournament model
// const { authMiddleware, isOrganizer, isPlayer, isReferee } = require("../middlewares/auth");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

/**
 * @route POST /tournament
 * @desc Create a tournament (Only Organizer)
 */
router.post("/tournament", authMiddleware, async (req, res) => {
  try {
    console.log(req.user);
    if(req.user.role !== "Organizer"){
        return res.status(403).json({ message: "Unauthorized to create a tournament" });
    }
    const { name, startDate, endDate, location, Teams } = req.body;

    if (!req.user || !req.user.userid) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const tournament = new Tournament({
      name,
      startDate,
      endDate,
      location,
      organizerId: req.user.userid,
      Teams,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await tournament.save();
    res.status(201).json({ message: "Tournament created successfully", tournament });
  } catch (error) {
    res.status(500).json({ message: "Error creating tournament", error: error.message });
  }
});

/**
 * @route GET /tournaments
 * @desc Get all tournaments
 */
router.get("/tournaments", async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tournaments", error: error.message });
  }
});

/**
 * @route GET /tournament/:id
 * @desc Get tournament details by ID
 */
router.get("/tournament/:id", authMiddleware, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ message: "Tournament not found" });

    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tournament", error: error.message });
  }
});

/**
 * @route PUT /tournament/:id
 * @desc Update a tournament (Only Organizer)
 */
router.put("/tournament/:id", async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ message: "Tournament not found" });

    if (tournament.organizerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this tournament" });
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    res.status(200).json(updatedTournament);
  } catch (error) {
    res.status(500).json({ message: "Error updating tournament", error: error.message });
  }
});

/**
 * @route DELETE /tournament/:id
 * @desc Delete a tournament (Only Organizer)
 */
router.delete("/tournament/:id", async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ message: "Tournament not found" });

    if (tournament.organizerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this tournament" });
    }

    await Tournament.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Tournament deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tournament", error: error.message });
  }
});

module.exports = router;
