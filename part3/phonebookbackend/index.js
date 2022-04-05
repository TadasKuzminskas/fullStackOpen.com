
// const http = require('http')
const PORT = process.env.PORT || 3001
const express = require('express')
const app = express();
const bp = require('body-parser')
const morgan = require('morgan')

//Adding Cors to Bypass CORS policy
const cors = require('cors')
app.use(cors())

// Source - https://stackoverflow.com/questions/51409771/logging-post-body-size-using-morgan-when-request-is-received
morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(bp.json()) //Had to add these in order for json body parsing to work. 
app.use(bp.urlencoded({ extended: true }))
app.use(morgan('tiny')) //Hopefully this is how it was expected to implement the middleware

app.use(express.static('build'))



let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Server running</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const infoPeople = persons.length
    const date = new Date()
    console.log(infoPeople)
    response.send(`<h3>Phonebook has info for ${infoPeople} people <br> ${date} </h3>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('id ', id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', morgan(':url :req[header] :body' ), (request, response) => {
    const body = request.body
    var id = Math.floor(Math.random() * 1000) //hope this is what was requested. 
    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    } else if ((persons.filter(person => person.name === body.name)).length) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: id,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)

})

app.listen(process.env.PORT, ()=> {
    console.log(`server running on port ${PORT}`)
})



