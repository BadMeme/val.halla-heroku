const express = require('express');
const router = express.Router();
const bcrypt = require ('bcrypt');
const methodOverride = require('method-override')

//middleware
const api = require('unofficial-valorant-api')


// Model Import
const Models = require('../models/models.js');
const {createUserToken} = require('../middleware/auth')


// Routes ('/test/:ext')

//test home
router.get('/', async (req, res) =>{
    try{
        async function getLeaderBoard () {
            let leaderBoard = []
            try {
              const response = await fetch('https://api.henrikdev.xyz/valorant/v1/leaderboard/na');
              console.log("test: ", response)
              const lbjson = await response.json()
              console.log("test: ", lbjson[0])
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
})

// Users Index
router.get("/users", async (req,res)=>{
    try{
        userIndex = await Models.User.find();
        res.send(userIndex)
    } catch(err){
        console.log(err)
    }
})

//User Show 
router.get("/profile/:ext", async (req, res) => {
    try {
        const user = await Models.User.find({username: req.params.ext})
        if (user.tag === null) {
            res.send("No tag for this user")
        }        
        const findAccount = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${user[0].username}/${user[0].tag}`) //change this to api funciton when we are less dumb
        const data = await findAccount.json()
        console.log("api return: ", data)

        // search match history by data.puuid
        // get w/l, champions, common players from match history
        // package all relevant data and send to user show page as context

        res.send(data)
    } catch(err) {
        console.log(err)
    }
})

//User update page
router.get("/profile/:ext/update", async (req,res) => {
    try {
        user = await Models.User.findById(req.params.ext)
        res.send("this works 2")
    } catch(err) {
        console.log(err)
    }
})

//User Update put
router.put('/update', async (req, res) => {
    try {
        res.json(
        await Models.User.findByIdAndUpdate(req.body._id, {avatar: req.body.avatar})
        //will probably rework or add anothe update route to include joining/leaving groups
        )
    } catch(err) {
        console.log(err)
    }
})

//User Delete req
router.delete('/delete', async (req, res) => {
    try {
        res.json(
        await Models.User.findByIdAndDelete(req.body._id)
        //will need to search database and delete other models tied to user's ._id
        )
    } catch(err) {
        console.log(err)
    }
})

module.exports = router;
