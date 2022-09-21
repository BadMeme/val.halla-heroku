const express = require('express');
const router = express.Router();
const bcrypt = require ('bcrypt');
const methodOverride = require('method-override');
const axios = require('axios');

//middleware
//const api = require('unofficial-valorant-api')


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
              const response = await Models.Player.find({leaderboardRank: {$gte: 1} && {$lte: 4}})
              //console.log("test: ", response)
              //const lbjson = await response.json()
              //console.log("test: ", lbjson[0])
              //leaderBoard = [lbjson[0], lbjson[1], lbjson[2], lbjson[3]]
              res.send(response) //currently fetching leaderboard from the backend instead of API call
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
        let [profile] = await Models.Player.find({gameName: req.params.ext})
        await console.log("user :" + profile)
       
        if (profile.card === null) {
            console.log("fix it")
            const findAccount = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${profile.gameName}/${profile.tag}`) //change this to api funciton when we are less dumb
            //await console.log(findAccount)
            let newInfo = await findAccount.json()
            ////console.log(newInfo.data)
            //await console.log ("newInfo: ", newInfo.data.card)
            let temp = await Models.Player.findByIdAndUpdate(profile._id, {
                card: newInfo.data.card
            })
            console.log("Temp data: ", temp)
            let profile = await temp;    
        }

        // if (profile.wr === null) { update it before it gets to the page }
      
        // search match history by data.puuid
        // get w/l, champions, common players from match history
        // package all relevant data and send to user show page as context

        res.send(profile)
    } catch(err) {
        console.log(err)
    }
})

//User update page
router.get("/update/:ext", async (req,res) => {
    try {
        const user = await Models.User.find({username: req.params.ext})
        //console.log("hows this: ", user)
        res.send(user)
    } catch(err) {
        console.log(err)
    }
})

//User Update put //may need to refactor 
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
