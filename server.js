// Dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const { PORT, MONGODB_URI } = process.env;
const testController = require("./controllers/test_controller");
const authController = require("./controllers/auth_controller");
const commentController = require("./controllers/comments_controller");
const groupController = require("./controllers/group_controller");

const cors = require("cors");
const morgan = require("morgan");

//Database Connection
//mongoose.connect(MONGODB_URI);
require('./config/db.connection')

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/test", testController);
app.use("/auth", authController);
app.use("/comment", commentController);
app.use("/group", groupController);

// Routes

app.get("/", (req, res) => {
  try{
    async function getLeaderBoard () {
        let leaderBoard = []
        try {
          const response = await fetch('https://api.henrikdev.xyz/valorant/v1/leaderboard/na');
          //console.log("test: ", response)
          const lbjson = await response.json()
          //console.log("test: ", lbjson[0])
          leaderBoard = [lbjson[0], lbjson[1], lbjson[2]]
          res.send(leaderBoard)
        } catch (err) {
          console.log(err);
        }
    }

    getLeaderBoard()
} catch(err) {
    console.log(err)
}
});

app.listen( PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


