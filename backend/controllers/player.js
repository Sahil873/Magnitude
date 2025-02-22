const authMiddleware = require("../middlewares/auth");
const express = require("express");
const Player=require("../models/Player");
const router = express.Router();

router.post("/player/hardcodedplayer", async (req, res) => {
    try {
        const hardCodedPlayers = [
            { username: "Faf du Plessis", score: 8 },
            { username: "Hashim Amla", score: 9 },
            { username: "AB de Villiers", score: 10 },
            { username: "Quinton de Kock", score: 8 },
            { username: "Graeme Smith", score: 8 },
            { username: "David Miller", score: 7 },
            { username: "Kagiso Rabada", score: 8 },
            { username: "Dwayne Bravo", score: 7 },
            { username: "Kieron Pollard", score: 7 },
            { username: "Sunil Narine", score: 8 },
            { username: "Shivnarine Chanderpaul", score: 8 },
            { username: "Chris Gayle", score: 9 },
            { username: "Jason Holder", score: 7 },
            { username: "Shakib Al Hasan", score: 9 },
            { username: "Tamim Iqbal", score: 8 },
            { username: "Mushfiqur Rahim", score: 8 },
            { username: "Mohammad Ashraful", score: 7 },
            { username: "Soumya Sarkar", score: 7 },
            { username: "Mehidy Hasan", score: 7 },
            { username: "Mominul Haque", score: 7 },
            { username: "Mohammad Hafeez", score: 8 },
            { username: "Shoaib Malik", score: 7 },
            { username: "Kamran Akmal", score: 7 },
            { username: "Imran Khan", score: 10 },
            { username: "Wasim Akram", score: 10 },
            { username: "Waqar Younis", score: 9 },
            { username: "Misbah-ul-Haq", score: 8 },
            { username: "Inzamam-ul-Haq", score: 9 },
            { username: "Mohammad Yousuf", score: 8 },
            { username: "Fakhar Zaman", score: 7 },
            { username: "Sarfaraz Ahmed", score: 7 },
            { username: "Shadab Khan", score: 7 },
            { username: "Babar Azam", score: 10 },
            { username: "Ben Stokes", score: 9 },
            { username: "Jos Buttler", score: 9 },
            { username: "Eoin Morgan", score: 8 },
            { username: "Joe Root", score: 9 },
            { username: "Andrew Flintoff", score: 9 },
            { username: "Kevin Pietersen", score: 9 },
            { username: "Marcus Stoinis", score: 7 },
            { username: "Nathan Lyon", score: 8 },
            { username: "Josh Hazlewood", score: 8 },
            { username: "Mitchell Marsh", score: 7 },
            { username: "Shaun Marsh", score: 7 },
            { username: "David Warner", score: 9 },
            { username: "Steve Smith", score: 10 },
            { username: "Pat Cummins", score: 9 },
            { username: "Ricky Ponting", score: 10 },
            { username: "Adam Gilchrist", score: 10 },
            { username: "Shane Warne", score: 10 },
            { username: "Glenn McGrath", score: 10 },
            { username: "Muttiah Muralitharan", score: 10 },
            { username: "Kumar Sangakkara", score: 10 },
            { username: "Mahela Jayawardene", score: 9 },
            { username: "Sanath Jayasuriya", score: 9 },
            { username: "Tillakaratne Dilshan", score: 8 },
            { username: "Lasith Malinga", score: 9 },
            { username: "Angelo Mathews", score: 8 }
        ];

        console.log("Inserting hardcoded players...");
        const players = await Player.insertMany(hardCodedPlayers);

        res.status(201).json({ message: "60 Hardcoded Players Added", players });
    } catch (error) {
        res.status(500).json({ message: "Error adding players", error: error.message });
    }
});


router.get("/players", async (req, res) => {
    try {
        const player = await Player.find();
        res.status(200).json(player);
      } catch (error) {
        res.status(500).json({ message: "Error fetching players", error: error.message });
      }
});


module.exports = router;
