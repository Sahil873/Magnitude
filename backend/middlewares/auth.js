const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to verify JWT and extract user role
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    console.log("Raw Token:", token);  // Log the entire token

    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const tokenParts = token.split(" ");
        console.log(tokenParts)
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(400).json({ error: "Invalid token format" });
        }

        const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
        // console.log("Decoded Token:", decoded);  // Log decoded token

        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
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