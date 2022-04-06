// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
const express = require('express')
const app = express()
const bp = require('body-parser')
const morgan = require('morgan')


//Adding Cors to Bypass CORS policy
const cors = require('cors')
app.use(cors())


//MongoDB definition
const Person = require('./models/person')

// Source - https://stackoverflow.com/questions/51409771/logging-post-body-size-using-morgan-when-request-is-received
morgan.token('body', (req) => JSON.stringify(req.body))

app.use(bp.json()) //Had to add these in order for json body parsing to work.
app.use(bp.urlencoded({ extended: true }))
app.use(morgan('tiny')) //Hopefully this is how it was expected to implement the middleware
app.use(express.static('build'))





app.get('/', (request, response) => {
  response.send('<h1>Server running</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => {
    next(error)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', morgan(':url :req[header] :body' ), (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(() => console.log(error => next(error))
    )
})

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})

//Error handler setup
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)