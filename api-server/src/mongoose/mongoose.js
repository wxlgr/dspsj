
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017', {
    dbName: 'dspsj'
}).then(() => console.log('Connected!'));

module.exports = mongoose
