const mongoose = require('mongoose');
// const password = '19841218';

// const URL = `mongodb+srv://keplib:${password}@cluster0.mupub.mongodb.net/phonebookApp`;

require('dotenv').config();
const URL = process.env.DB_URL
const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const PhonebookEntry = mongoose.model('Entry', phonebookSchema);


// CREATE NEW ENTRY

// mongoose
//     .connect(URL)
//     .then((result) => {
//         console.log('connected')

//         const testEntry = new PhonebookEntry({
//             name: 'Buga Jakab',
//             number: '1234'
//         })

//         return testEntry.save()
//     })
//     .then(() => {
//         console.log('person saved!')
//         return mongoose.connection.close()
//     })
//     .catch((err) => console.log(err))



// RETRIEVE ENTRIES FROM DB
mongoose.connect(URL)
    .then((result) => {
        PhonebookEntry.find()
            .then(result => {
                console.log(result)
                mongoose.connection.close()
            })
    });


