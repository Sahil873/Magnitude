const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to verify JWT and extract user role
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    console.log(token)
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        console.log(decoded);
        req.user = decoded;  // Attach user info to request
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;


// Protected Route Example (Accessible by all authenticated users)
// router.get("/protected", authMiddleware(), (req, res) => {
//     res.json({ message: "Protected content", user: req.user });
// });

// // Admin-Only Route
// router.get("/admin", authMiddleware(["admin"]), (req, res) => {
//     res.json({ message: "Admin access granted", user: req.user });
// });