require('dotenv').config() // for getting MONGO_DB_PASSWORD
const mongoose = require('mongoose')
const url = process.env.MONGO_DB_URI

mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
})
.catch((error) => {
    console.log('error connecting to MongoDB', error.message)
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        minLength: 9,
        validate: {
            validator: function(v) {
                return /\d{3}-\d{x}/.test(v) || /\d{2}-\d{5}/.test(v); //Made it work, but I'm not sure I understand it. Did not find anything about formatting on the web.
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)