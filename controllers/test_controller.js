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
        let user = await Models.User.find({username: req.params.ext})
        await console.log("user :" + user)
        const findAccount = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${user[0].username}/${user[0].tag}`) //change this to api funciton when we are less dumb
            const data = await findAccount.json()
            // const player = await Models.Player.create({
            //     puuid: data.data.puuid,
            //     card: data.data.card,
            // })
            // await Models.User.findByIdAndUpdate(user._uid, {
            //     puuid: player.puuid,
            //     linkedPlayer: player._id
            // })
        
        // let user = await Models.User.find({username: req.params.ext})
        // await console.log ("user.info: ", user[0].puuid)
        // //await console.log ("card info: ", data.data.card)
        // if (user[0].puuid == null) {
        //     const findAccount = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${user[0].username}/${user[0].tag}`) //change this to api funciton when we are less dumb
        //     const data = await findAccount.json()
        //     const player = await Models.Player.create({
        //         puuid: data.data.puuid,
        //         card: data.data.card,
        //     })
        //     await Models.User.findByIdAndUpdate(user._uid, {
        //         puuid: player.puuid,
        //         linkedPlayer: player._id
        //     })
        // }   

        // search match history by data.puuid
        // get w/l, champions, common players from match history
        // package all relevant data and send to user show page as context

        res.send(data)
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
