const dotenv = require("dotenv");
dotenv.config()
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
    {
        username: "ItsMe",
        name: "Mario",
        password: "password123"
        },
        {
        username: "RockySandra",
        name: "Sandra",
        password: "myComputer"
        }
]

beforeEach(async () => {
    await User.deleteMany({})
    let userObject = new User(initialUsers[0])
    await userObject.save()
    userObject = new User(initialUsers[1])
    await userObject.save()
  }, 100000)

test('can receive user from server', async () => {
    const response = await api.get('/api/users').expect(200)
    expect(response.body[1].username).toContain(initialUsers[1].username)
})

test('can add a new user', async () => {
    let newUser = User({
            username: "testing",
            name: "test",
            password: "test123", 
    })
    try {
    await newUser.save()
    //const newUser = await api.post('/api/users', newUser).expect(200) 
    const response = await api.get('/api/users').expect(200)
    expect(response.body[2].username).toContain(newUser.username)
    } catch (err) {
        expect(err).toBe('test')
    }
})

test('can add an invalid new user', async () => {
    let newUser = User({
            username: "tes",
            name: "test",
            password: "test123", 
    })
    try {
    await newUser.save()
    } catch (err) {
        expect(err).toBe(400) // Works, but I don't know how to test if it's the correct error message
    }
})


afterAll(() => {
    mongoose.connection.close()
})