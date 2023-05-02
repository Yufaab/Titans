const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const studentSchema = new mongoose.Schema({
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
  password:{
      type: String,
      required: [true, "Please provide password"],
      minLength: 8,
      trim: true,
  },
  phone: {
      type: Number,
      required: [true, "Please provide your phone number"],
      minLength: 10,
      maxLength: 10
  },
  getOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Orders',
    index: true
  }],
  tokens: [{
      token:{
          type: String,
          required: true
      }
  }],
}, {
  timestamps: true
})

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

studentSchema.statics.updateSchema = async function(id, data) {
  const user = await Student.findByIdAndUpdate(id, {
    ...data,
  }, {new: true});
  return user
}

studentSchema.pre('save' , async function (next) {
  const user = this
  if(user.isModified('password')){
      user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student