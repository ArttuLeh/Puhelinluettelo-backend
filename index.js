//const { response, request } = require('express')
const cors = require('cors')
const express = require('express')
var morgan = require('morgan')
const app = express()

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()
}


app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', function (req, res) { 
    return [
        JSON.stringify(req.body)
    ] 
})

let persons = [
    {
        "name": "Arto Hellas",
        "number": "0500-1231234",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Keijo Kaljunen",
        "number": "040-1231234",
        "id": 4
      },
      {
        "name": "Jaakko Parantainen",
        "number": "050-1231234",
        "id": 5
      }
]

app.get('/info', (require, response) => {
    response.send(
        `<p>Phonebook has info 5 people</p><br><p>${new Date()}</p>`
        )
})

app.get('/api/persons', (require, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } 
    else {response.status(404).end()}
})

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * 100)
    //console.log(id)
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number are missing'
        })
    }else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'Person already exists'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: id,
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})