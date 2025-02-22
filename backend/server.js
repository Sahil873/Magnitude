require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const tournament = require("./controllers/tournament");
const app = express();
app.use(express.json());

app.use("/", authRoutes);
app.use("/", tournament);


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3000, () => console.log("Server running on port 3000")))
    .catch(err => console.log(err));
