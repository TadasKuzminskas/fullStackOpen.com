const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

// loginRouter.post('/', async (request, response) => {
//   const { username, password } = request.body

//   const user = await User.findOne({ username })
//   const passwordCorrect = user === null
//     ? false
//     : await bcrypt.compare(password, user.password)

//   if (!(user && passwordCorrect)) {
//     return response.status(401).json({
//       error: 'invalid username or password'
//     })
//   }

//   const userForToken = {
//     username: user.username,
//     id: user._id,
//   }

//   const token = jwt.sign(userForToken, process.env.SECRET)

//   response
//     .status(200)
//     .send({ token, username: user.username, name: user.name })
// })

loginRouter.post('/', (request, response) => {
    const { username, password } = request.body
  
    User.findOne({ username }).then(user => {
        user === null
        ? false
        : bcrypt.compare(password, user.password).then(passwordCorrect => {
            if (!(user && passwordCorrect)) {
                return response.status(401).json({
                  error: 'invalid username or password'
                })
              }

              const userForToken = {
                username: user.username,
                id: user._id,
              }

              const token = jwt.sign(userForToken, process.env.SECRET)
  
              response
                .status(200)
                .send({ token, username: user.username, name: user.name })
        })
    })

  })


module.exports = loginRouter