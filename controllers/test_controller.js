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



//Profile Show 
router.get("/profile/:ext/:tag", async (req, res) => {
    try {
        // let [profile] = await Models.Player.find({gameName: req.params.ext})
        // console.log("user: " + profile)
        
        //let real = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${profile.gameName}/${profile.tag}`)
        let real = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${preq.params.ext}/${req.params.tag}`)
        let data = await real.json();

        //console.log("Fest test: ", apiData.data)
        const real2 = await fetch(`https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr/na/${data.data.puuid}`)
        //console.log("Resonse 2: ", response2)
        const data2 = await real2.json();

        const real3 = await fetch(`https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/na/${data.data.puuid}`)
        const data3 = await real3.json();

        const context = {
            puuid: data.data.puuid,
            name: data.data.name,
            tag: data.data.tag,
            region: data.data.region,
            account_level: data.data.account_level,
            card: data.data.card,
            currenttier: data2.data.currenttier,
            elo: data2.data.elo,
            images: data2.data.images,// {lareg, small, triangle_down, triangle_up}, //this is rank
            ranking_in_tier: data2.data.ranking_in_tier, 
            matchHistory_small: data3.data,
            //The following is derived data that i will calulate above
            wr: "Testing",
            favHeros: ["Testing", "OneTwo", "Three"],
            favGun: "Gun",
            friends: ["This will take math"]
        }
        // if (profile.wr === null) { update it before it gets to the page }
      
        // search match history by data.puuid
        // get w/l, champions, common players from match history
        // package all relevant data and send to user show page as context

        res.send(context)
    } catch(err) {
        console.log(err)
    }
})

//User Show

router.get("/user/:ext", async (req,res) => {
    try {
        const user = await Models.User.find({username: req.params.ext})
        //console.log("hows this: ", user)
        res.send(user)
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
