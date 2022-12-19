const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const URL = process.env.DB_URL;

const app = express();
const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const PhonebookEntry = mongoose.model('Entry', phonebookSchema);


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(express.static('dist'))
app.use(cors());
app.use(express.json());
app.use(requestLogger);

const now = new Date();

let persons = [];

app.get('/', (req, res) => {
    res.send('<h1>Server is running on port 3000!</h1>')
});

app.get('/api/persons', (req, res) => {
    mongoose.connect(URL)
        .then((result) => {
            PhonebookEntry.find()
                .then(result => {
                    persons = result;
                    res.send(result)
                    mongoose.connection.close()
                })
        });
});

app.get('/info', (req, res) => {
    res.write(`There are ${persons.length} entries in the database`)
    res.end(`${now}`);
})

app.get('/api/persons/:id', (req, res) => {
    mongoose.connect(URL)
        .then((result) => {
            PhonebookEntry.find({ _id: req.params.id })
                .then(result => {
                    res.status(200);
                    res.json(result)
                    mongoose.connection.close()
                })
        });
});

app.delete('/api/persons/:id', (req, res) => {
    mongoose.connect(URL)
        .then((result) => {
            PhonebookEntry.deleteOne({ _id: req.params.id })
                .then(result => {
                    res.status(200);
                    res.json(result)
                    mongoose.connection.close()
                })
        });
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number is missing'
        })
    }
    mongoose.connect(URL)
        .then((result) => {
            const newPerson = new PhonebookEntry({
                name: body.name,
                number: body.number,
            });
            return newPerson.save();
        })
        .then(() => {
            console.log('entry saved!')
            return mongoose.connection.close();
        })
        .catch((err) => console.log(err))
    res.status(200);
    res.send('OK, got the data')
});


app.put('/api/persons/:id', (req, res) => {

    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number is missing'
        })
    }
    mongoose.connect(URL)
        .then((result) => {
            PhonebookEntry.findByIdAndUpdate(req.params.id, { number: body.number })
                .then(response => {
                    res.status(200)
                    res.json(response)
                    mongoose.connection.close()
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
});

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});


