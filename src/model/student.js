const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const studentSchema = new mongoose.Schema({
  firstname: {
      type: String,
      required: true,
      trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email:{
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
          if(!validator.isEmail(value)){
              throw new Error('Invalid Email')
          }
      }
  },
  password:{
      type: String,
      required: false,
      minLength: 7,
      trim: true,
  },
  tokens: [{
      token:{
          type: String,
          required: true
      }
  }],
}, {
  timestamps: true
})

const Student = mongoose.model('Student', studentSchema)

studentSchema.methods.toJSON = function (){
  const user = this

  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens

  return userObject
}

studentSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({_id : user._id} , 'My Secret')

  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

studentSchema.statics.findByCredentials = async (email,password) => {
  const user = await Student.findOne({ email })
  if(!user){
      throw new Error('Unable to login')
  }

  if (password) {
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
  }

  return user
}

studentSchema.pre('save' , async function (next) {
  const user = this
  if(user.isModified('password')){
      user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

module.exports = Student