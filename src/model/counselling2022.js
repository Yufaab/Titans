const mongoose = require('mongoose');

const counselling2022Schema = new mongoose.Schema({
  institute: {
    type: String,
    required: true,
  },
  academicProgramName: {
    type: String,
    required: true,
  },
  quota: {
    type: String,
    required: true,
  },
  seatType: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  openingRank: {
    type: Number,
    required: true,
  },
  closingRank: {
    type: Number,
    required: true,
  },
})

const Counselling2022 = mongoose.model('Counselling2022',counselling2022Schema)

module.exports = Counselling2022;