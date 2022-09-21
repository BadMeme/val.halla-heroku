///////////////////////////////
// DEPENDENCIES
////////////////////////////////

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

///////////////////////////////
// MODELS
////////////////////////////////

const { User } = require("../models/models");
const { createUserToken, requireToken } = require("../middleware/auth");

///////////////////////////////
// ROUTES
////////////////////////////////

router.get("/user/:id", requireToken, async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);
    res.status(201).json({ _id: foundUser._id, username: foundUser.username });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// AUTH REGISTER ROUTE (CREATE - POST -> generate a model instance in the db -> create a token)
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const pwStore = req.body.password;
    // we store this temporarily so the origin plain text password can be parsed by the createUserToken();

    req.body.password = passwordHash;
    // modify req.body (for storing hash in db)

    const newUser = await User.create(req.body);
    if (newUser) {
      req.body.password = pwStore;
      const authenticatedUserToken = createUserToken(req, newUser);
      res.status(201).json({
        user: newUser,
        isLoggedIn: true,
        token: authenticatedUserToken,
      });
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// AUTH LOGIN ROUTE (POST - create token if credentials match)
router.post("/login", async (req, res) => {
  try {
    const logggingUser = req.body.username;
    const foundUser = await User.findOne({ username: logggingUser });
    const token = await createUserToken(req, foundUser);
    console.log("created token:", token);
    res.status(200).json({ user: foundUser, isLoggedIn: true, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
