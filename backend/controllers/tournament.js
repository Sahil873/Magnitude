const express = require("express");
const Tournament = require("../models/Tournament"); // Import Tournament model
// const { authMiddleware, isOrganizer, isPlayer, isReferee } = require("../middlewares/auth");
const authMiddleware = require("../middlewares/auth");
const Player=require("../models/Player");
const { Heap } = require("heap-js");
const router = express.Router();
const Team = require("../models/Team");
/**
 * @route POST /tournament
 * @desc Create a tournament (Only Organizer)
 */
router.post("/tournament", authMiddleware, async (req, res) => {
  try {
    console.log(req.body);
    if(req.user.role !== "Organizer"){
        return res.status(403).json({ message: "Unauthorized to create a tournament" });
    }
    const { name, startDate, endDate, location, Teams , schedule, playoff} = req.body;

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
      schedule,
      playoff,
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
router.get("/tournament/:id", async (req, res) => {
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
router.put("/tournament/:id", authMiddleware, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ message: "Tournament not found" });
    console.log(tournament.organizerId.toString());
    console.log(req.user.userid);
    if (tournament.organizerId.toString() !== req.user.userid) {
        return res.status(403).json({ message: "Unauthorized to delete this tournament" });
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
router.delete("/tournament/:id", authMiddleware, async (req, res) => {
  try {
    if(req.user.role !== "Organizer"){
        return res.status(403).json({ message: "Unauthorized to delete a tournament" });
    }
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ message: "Tournament not found" });
    // console.log(tournament.organizerId.toString());
    // console.log(req.user.userid);
    if (tournament.organizerId.toString() !== req.user.userid) {
      return res.status(403).json({ message: "Unauthorized to delete this tournament" });
    }
    
    await Tournament.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Tournament deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tournament", error: error.message });
  }
});

router.post("/tournament/:id/autoallocate", authMiddleware, async (req, res) => {
    try {

        if (req.user.role !== "Organizer") {
            return res.status(403).json({ message: "Unauthorized to create a tournament" });
        }

        const players = await Player.find();
        const tournament = await Tournament.findById(req.params.id);
        console.log(tournament);
        if (!tournament) {
            return res.status(404).json({ message: "Tournament not found" });
        }

        let teams = tournament.Teams; // Ensure teams exist
        if (!teams || teams.length === 0) {
            return res.status(400).json({ message: "Tournament has no teams to allocate players" });
        }

        // Priority queue (MaxHeap) based on player score
        const pq = new Heap((a, b) => b.score - a.score); // MaxHeap: highest score first
        pq.init(players);

        let n = teams.length;
        let idx = 0;

        while (!pq.isEmpty()) {
            const player = pq.pop();

            // Ensure team has a `players` array
            if (!teams[idx].players) {
                teams[idx].players = [];
            }

            if (teams[idx].players.length < 11) { // Limit team size to 11 players
                teams[idx].players.push(player._id);
            }else{
                continue;
            }

            idx = (idx + 1) % n; // Round-robin allocation
        }

        for(let i=0;i<teams.length;i++){
            // await teams[i].save();
        }

        tournament.Teams = teams; // Correct assignment
        await tournament.save();

        res.status(201).json({ message: "Players allocated successfully", tournament });

    } catch (error) {
        res.status(500).json({ message: "Error allocating players", error: error.message });
    }
});

module.exports = router;
