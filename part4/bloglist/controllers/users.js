const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', (request, response) => {

    User.find({}).populate('blogs').then(users => {
            response.json(users)
      })
  })
  
usersRouter.post('/', (request, response, next) => {
    const body = request.body
    const { username, name, password } = request.body

    //This was a Gottcha! moment regarding synchronous functions. Async did'nt work.

    User.findOne({ username }).then(existingUser => {
        if (existingUser){
            return response.status(400).json({
                error: 'username must be unique'
            })
        }
    }).then(() => {
        if (password.length < 4 || username.length < 4) {
            return response.status(400).json({
                error: 'illegal lenght requirements. Check password and username lenght'
            })
        }
    }).then(
    bcrypt.hash(body.password, 10).then(hash => {
        const user = new User({
            username: body.username, 
            name: body.name, 
            password: hash
        }) 
        user.save().then(result => {
            response.status(201).json(result)
        }).catch(
            error => next(error)
          )
    }))
    
 })

module.exports = usersRouter