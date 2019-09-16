// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const bcryptSalt = 10;

mongoose
  .connect('mongodb://localhost/my-dev-dash', {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

let users = [{
    username: "alice",
    password: bcrypt.hashSync("alice", bcrypt.genSaltSync(bcryptSalt)),
  },
  {
    username: "bob",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
  }
]

const testUsers = [{
    name: 'John Doe',
    password: 'test1234',
    email: 'john@doe.com',
    city: 'Berlin',
    level: 'intermediate',
    mentorship: 'yes',
    connections: [],
    interests: ['react', 'javascript'],
    pinnedContent: [],
    githubLink: ''
  },
  {
    name: 'Jane Doe',
    password: 'test1234',
    email: 'jane@doe.com',
    city: 'Berlin',
    level: 'advanced',
    mentorship: 'yes',
    connections: [],
    interests: ['ruby', 'javascript'],
    pinnedContent: [],
    githubLink: ''
  }
]

User.deleteMany()
  .then(() => {
    return User.create(testUsers)
  })
  .then(usersCreated => {
    console.log(`${usersCreated.length} users created with the following id:`);
    console.log(usersCreated.map(u => u._id));
  })
  .then(() => {
    // Close properly the connection to Mongoose
    mongoose.disconnect()
  })
  .catch(err => {
    mongoose.disconnect()
    throw err
  })