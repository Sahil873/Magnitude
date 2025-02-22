const express = require("express");
const authMiddleware = require("../middlewares/auth");
const router = require("../routes/authRoutes");

router.post("/create", authMiddleware, async (req, res) => {
    try {
        const tournament = await Tournament.create(req.body);
        res.status(201).json(tournament);
    } catch (error) {
        res.status(500).json({ error: "Error creating tournament" });
    }
});
