
const { User, Group, Comment } = require('./models')
const bcrypt = require('bcrypt')
const {createUserToken , requireUserToken} = require('../middleware/auth')
const mongoose = require('mongoose')

require('../config/db.connection')

testUsers = [
    {
        username: "heaviside",
        password: "seed",
        //email will write in at function
        tag: "JSON"
    },
    {
        username: "SimpMaster69",
        password: "seed",
        //email
        tag: "NA1"
    },
    {
        username: "dickvaper",
        password: "seed",
        //email
        tag: "mcbee"
    }
]

async function clearDB() {
    await User.deleteMany();
    await Group.deleteMany();
    await Comment.deleteMany();
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

async function seedUsers (arr) {
    
    await clearDB();
    console.log("DB cleared")
    
    for (i = 0; i < arr.length; i++) {
        await createUser(arr[i], i)
    }

    mongoose.connection.close()
}

seedUsers(testUsers);