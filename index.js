const express = require('express')
const morgan = require('morgan')
// uncomment all for logging to file using stream - logs to console by default
// const fs = require('fs')
// const path = require('path')
// const appLogStream = fs.createWriteStream(path.join(__dirname, 'app.log'))

const app = express()

app.use(express.json())

app.use(
  morgan(
    ':method :url :status :res[content-length] :response-time ms :info',
    // {
    //   stream: appLogStream,
    // },
  ),
)
morgan.token('info', req => JSON.stringify(req.info))

let persons = [
  {
    name: 'Chris Ziegler',
    number: '332-1796',
    id: 1,
  },
  {
    name: 'Jimi Hendrix',
    number: '555-1212',
    id: 2,
  },
  {
    name: 'Jim Gaffigan',
    number: '867-5309',
    id: 3,
  },
  {
    name: 'Artie Lang',
    number: '123-4567',
    id: 4,
  },
]

const getRandom = () => {
  return Math.floor(Math.random() * 1000000)
}

const four04 = `<body style="background: rgb(2,0,36); background: linear-gradient(153deg, rgba(2,0,36,1) 0%, rgba(250,95,27,1) 50%, rgba(0,212,255,1) 100%);">
<h1 style="position: fixed; top: 48%; left: 37%; color: white; text-shadow: 1px 1px 1px #000;">404 - Resource Not Found</h1>`

app.get('/', (req, res) => {
  res.send('<h1>Hello from Express</h1>')
})

const entries = persons.length
app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${entries} people</p><p>${new Date()}`,
  )
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const found = persons.find(person => person.id === id)
  if (!found) {
    return res.status(404).send(`${four04}`)
  }
  res.json(found)
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  req.info = body
  if (!body.name || !body.number) {
    res.status(404).send({
      error: 'name & number are required',
    })
  }
  if (persons.find(person => person.name === body.name)) {
    return res.status(400).send({
      error: 'name already in use',
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: getRandom(),
  }

  persons = persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(contact => contact.id != id)

  res.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`)
})
