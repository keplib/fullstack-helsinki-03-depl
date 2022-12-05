const express = require('express');
const cors = require('cors');
const PORT = 3000;
const app = express();

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}



app.use(cors());
app.use(express.json());
app.use(requestLogger);

const now = new Date();


// Function to generate a random number for id
const generateRandomID = () => {
    return Math.floor(Math.random() * 10000);
}

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


app.get('/', (req, res) => {
    res.send('<h1>Server is running on port 3000!</h1>')
});

app.get('/api/persons', (req, res) => {
    res.send(persons);
});

app.get('/info', (req, res) => {
    res.write(`There are ${persons.length} entries in the database`)
    res.end(`${now}`);
})

app.get('/api/persons/:id', (req, res) => {
    const personToReturn = persons.filter(person => person.id === Number(req.params.id))
    res.send(personToReturn);
});

app.delete('/api/persons/:id', (req, res) => {
    let id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number is missing'
        })
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateRandomID()
    };
    persons.push(newPerson);
    res.status(200);
    res.send('OK, got the data')

})

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});


