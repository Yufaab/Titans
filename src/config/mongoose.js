const mongoose = require('mongoose');
const { mongouri } = require('./vars');

mongoose.connect(mongouri, {
  useNewUrlParser: true,
  // useCreateIndex: true
});
