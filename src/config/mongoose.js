const mongoose = require('mongoose');
const { mongouri } = require('.vars.js');

mongoose.connect(mongouri, {
    useNewUrlParser: true,
    // useCreateIndex: true
})