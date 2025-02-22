// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Player=require("../models/Player")
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleware = require("../middlewares/auth")

// Register User
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await user.save();

        if (role === "Player") {
            const player = new Player({
                userId: user.id,
                // tournamentId: '', // Assign dynamically later
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await player.save();
        }

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error registering user" });
    }
});

// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: "Error logging in" });
    }
});


router.get("/auth/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        let player = null;
        if (user.role === "Player") {
            player = await Player.findOne({ userId: user.id });
        }

        res.status(200).json({ user, player });
    } catch (error) {
        res.status(500).json({ error: "Error fetching profile" });
    }
});


module.exports = router;
