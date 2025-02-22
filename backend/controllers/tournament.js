const express = require("express");
const Tournament = require("../models/Tournament"); // Import Tournament model
// const { authMiddleware, isOrganizer, isPlayer, isReferee } = require("../middlewares/auth");
const authMiddleware = require("../middlewares/auth");
const Player=require("../models/Player");
const { Heap } = require("heap-js");
const router = express.Router();
const Team = require("../models/Team");
const Match = require("../models/Match");
/**
 * @route POST /tournament
 * @desc Create a tournament (Only Organizer)
 */
router.post("/tournament", authMiddleware, async (req, res) => {
    try {
      console.log(req.body);
      if (req.user.role !== "Organizer") {
        return res.status(403).json({ message: "Unauthorized to create a tournament" });
      }
  
      const { name, Teams, schedule } = req.body;
  
      if (!req.user || !req.user.userid) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      // Check if Teams exist in request body
      if (!Teams || !Array.isArray(Teams) || Teams.length === 0) {
        return res.status(400).json({ message: "At least one team is required to create a tournament" });
      }
  
      // Create teams and store only their ObjectIds
      const teamIds = [];
      for (let teamData of Teams) {
        const newTeam = new Team({ name: teamData.name , score: teamData.score, players: teamData.players}); // Assuming 'name' field exists in Team schema
        const savedTeam = await newTeam.save();
        teamIds.push(savedTeam._id);
      }
  
      // Create Tournament with only team IDs
      const tournament = new Tournament({
        name,
        organizerId: req.user.userid,
        Teams: teamIds,  // Store only ObjectIds of teams
        schedule,
        // playoff,
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
        const tournaments = await Tournament.find()
            .populate({
                path: "Teams",
                populate: { path: "players" } // Populate players inside each team
            })
            .populate({
                path: "schedule",
                populate: [{ path: "teamAId" }, { path: "teamBId" }] // Populate both teamAId and teamBId inside schedule
            });

        // Transform the response
        const transformedTournaments = tournaments.map(tournament => {
            return {
                ...tournament.toObject(),
                schedule: tournament.schedule.map(match => ({
                    ...match.toObject(),
                    teamA: match.teamAId ? match.teamAId.name : null, // Replace teamAId with teamA (name)
                    teamB: match.teamBId ? match.teamBId.name : null, // Replace teamBId with teamB (name)
                    teamAId: undefined, // Remove teamAId field
                    teamBId: undefined,  // Remove teamBId field
                    __v:undefined
                }))
            };
        });

        res.status(200).json(transformedTournaments);
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
      const tournament = await Tournament.findById(req.params.id)
        .populate({
          path: "Teams",
          populate: { path: "players" } // Populate players inside each team
        })
        .populate({
          path: "schedule",
          populate: [{ path: "teamAId" }, { path: "teamBId" }] // Populate both teamAId and teamBId inside schedule
        });
  
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
  
      // Transform the response
      const transformedTournament = {
        ...tournament.toObject(),
        schedule: tournament.schedule.map(match => ({
          ...match.toObject(),
          teamA: match.teamAId ? match.teamAId.name : null, // Replace teamAId with teamA (name)
          teamB: match.teamBId ? match.teamBId.name : null, // Replace teamBId with teamB (name)
          teamAId: undefined, // Remove teamAId field
          teamBId: undefined,  // Remove teamBId field
          __v: undefined
        }))
      };
  
      res.status(200).json(transformedTournament);
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
            return res.status(403).json({ message: "Unauthorized to allocate players" });
        }

        console.log(req.params.id);
        const players = await Player.find(); 
        const tournament = await Tournament.findById(req.params.id).populate("Teams"); // Ensure Teams are populated
        console.log(tournament);
        if (!tournament) {
            return res.status(404).json({ message: "Tournament not found" });
        }

        let teams = tournament.Teams;
        if (!teams || teams.length === 0) {
            return res.status(400).json({ message: "Tournament has no teams to allocate players" });
        }

        // MaxHeap based on player score
        const pq = new Heap((a, b) => b.score - a.score);
        pq.init(players);

        let n = teams.length;
        let idx = 0;

        while (!pq.isEmpty()) {
            const player = pq.pop();

            if (!teams[idx].players) {
                teams[idx].players = [];
            }

            if (teams[idx].players.length < 11) {
                teams[idx].players.push(player._id);
            } else {
                idx = (idx + 1) % n;
                continue;
            }

            idx = (idx + 1) % n;
        }

        // ✅ Update existing teams in the database instead of creating new ones
        for (let i = 0; i < teams.length; i++) {
            await Team.findByIdAndUpdate(teams[i]._id, { $set: { players: teams[i].players } });
        }

        res.status(201).json({ message: "Players allocated successfully", tournament });

    } catch (error) {
        res.status(500).json({ message: "Error allocating players", error: error.message });
    }
});


router.post("/tournament/:id/schedulematches", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "Organizer") {
            return res.status(403).json({ message: "Unauthorized to schedule matches" });
        }

        console.log(req.params.id);
        const tournament = await Tournament.findById(req.params.id).populate("Teams");
        // const tournament = await Tournament.findById(req.params.id);
        // console.log(tournament);
        if (!tournament) {
            return res.status(404).json({ message: "Tournament not found" });
        }

        let teams = tournament.Teams;
        if (!teams || teams.length < 2) {
            return res.status(400).json({ message: "Tournament must have at least two teams to schedule matches" });
        }

        let schedule = [];
        let n = teams.length;
        
        // Generate round-robin match schedule
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                match1=new Match({
                    tournamentId: tournament._id,
                    teamAId: teams[i]._id,
                    teamBId: teams[j]._id,
                    winner: "TBD"
                });
                await match1.save();
                schedule.push(match1._id);
            }
        }

        tournament.schedule = schedule;
        tournament.markModified("Teams");
        await tournament.save();

        res.status(201).json({ message: "Matches scheduled successfully", schedule });
    } catch (error) {
        res.status(500).json({ message: "Error scheduling matches", error: error.message });
    }
});

module.exports = router;
