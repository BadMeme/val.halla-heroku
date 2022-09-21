
const { User, Group, Comment, Player } = require('./models')
const bcrypt = require('bcrypt')
const {createUserToken , requireUserToken} = require('../middleware/auth')
const mongoose = require('mongoose')
const { response } = require('express')

require('../config/db.connection')

testUsers = [
    {
        username: "heaviside",
        password: "seed",
        //email will write in at function
        tag: "JSON"
    },
    // {
    //     username: "SimpMaster69",
    //     password: "seed",
    //     //email
    //     tag: "NA1"
    // },
    {
        username: "dickvaper",
        password: "seed",
        //email
        tag: "mcbee"
    },
    {
        username: "Giotto",
        password: "seed",
        tag: "GEN1"
    }
]

async function clearDB() {
    await User.deleteMany();
    await Group.deleteMany();
    await Comment.deleteMany();
    await Player.deleteMany();
}

async function createUser(seed, idx) {
    try {
        
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(seed.password, salt)
        seed.password = passwordHash
        seed.email = `test${idx}@seed.com`
        console.log("Seed: ", seed)
        const newUser = await User.create(seed)
        console.log("seeding...: ", newUser)
        //let createdUser = await User.create( seed );
        //console.log(accountArtist)
        //return newUser;
    } catch (err) {
        console.log(err)
    }
}

async function createPlayer (seed) {
    try {
        await console.log("Seed player: ", seed)
        await Player.create({
            gameName: seed.gameName,
            tag: seed.tagLine,
            puuid: seed.puuid,
            leaderboardRank: seed.leaderboardRank,
            rankedRating: seed.rankedRating,
            numberOfWins: seed.numberOfWins,
            competitiveTier: seed.competitiveTier,
        })

    } catch (err) {
        console.log(err)
    }
}

async function updatePlayer (seed) {
    try {
    
    } catch (err) {

    }
}

async function seedUsers (arr) {
    
    //await clearDB();
    //console.log("DB cleared")
    
    for (i = 0; i < arr.length; i++) {
        await createUser(arr[i], i)
    }

    //mongoose.connection.close()
}

async function seedPlayers() {
    const response = await fetch('https://api.henrikdev.xyz/valorant/v1/leaderboard/na');
    playersArr = await response.json()
    for (i = 0; i < 100; i++) {
        await createPlayer (playersArr[i])
    }
    
}

async function seedTestPlayers() {
    for (i = 0; i < testUsers.length; i++) {
        const findAccount = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${testUsers[i].name}/${testUsers[i].tag}`)
        let testPlayer = await findAccount.json()
        await console.log("Test Player: ", testPlayer.data)
        // testPlayer.data.gameName = testUsers[i].username
        // testPlayer.data.tagline = testUsers[i].tag

        let temp = {
            puuid: testPlayer.data.puuid,
            gameName: testUsers[i].username,
            tagLine: testUsers[i].tag,
            card: testPlayer.data.card,


        }
        
        await console.log("Test transform :", temp)
        await createPlayer (temp)
    }
}

async function seedDatabase () {
    await clearDB();
    await console.log("DB cleared")

    await seedUsers(testUsers)
    await console.log("users seeded")
    // await seedTestPlayers()
    // await console.log("test players seeded")
    await seedPlayers();
    await console.log("top players seeded")

    mongoose.connection.close()
}
//seedUsers(testUsers);

seedDatabase ()