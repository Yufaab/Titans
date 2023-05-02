const mongoose = require('mongoose');
const validator = require('validator')

const reiviewSchema = new mongoose.Schema({
  firstname: {
      type: String,
      required: [true, "Please provide your first name"],
      trim: true
  },
  lastname: {
    type: String,
    required: [false, "Please provide your last name"],
    trim: true
  },
  email:{
      type: String,
      unique: true,
      required: [true, "Please provide your email address"],
      trim: true,
      lowercase: true,
      validate(value) {
          if(!validator.isEmail(value)){
              throw new Error('Please provide a valid Email')
          }
      }
  },
  reviewdata: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: false,
  }
}, {
  timestamps: true
})

const Review = mongoose.model('Review', reiviewSchema)

module.exports = Review