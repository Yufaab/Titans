const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    rank: {
        type: Number,
        trim: true,
        required: [true, "Please provide rank"],
        maxLength: 7,
        minLength: 1
    },
    seatType: {
        type: String,
        enum: ['OPEN', 'OBC-NCL', 'SC', 'EWS', 'ST' , 'OPEN (PwD)', 'OBC-NCL (PwD)', 'SC (PwD)', 'EWS (PwD)', 'ST (PwD)'],
        trim: true,
        required: [true, "Please choose your category"],
    },
    gender: {
        type: String,
        enum: [ 'Gender-Neutral', 'Female-only (including Supernumerary)' ],
        required: true,
        trim: true,
    },
    categoryRank: {
        type: Number,
        required: false,
        trim: true,
        maxLength: 7,
        minLength: 1
    },
    disability: {
        type: Boolean,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim : [true, "Please provide your domicile state"]
    },
    branchPreference: [{
        name: {
            type: String,
            required: false,
            trim: true
        }
    }],
    collegePreference: [{
        name: {
            type: String,
            required: false,
            trim: true
        }
    }],
    examType: {
        type: String,
        required: false,
        trim: true
    },
    orderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        index: true,
        required: true
    }
},{
    timestamps: true
})

orderSchema.statics.updateSchema = async function(id, data) {
    const user = await Orders.findByIdAndUpdate(id, {
      ...data,
    }, {new: true});
    return user
  }

const Orders = mongoose.model('Orders',orderSchema)

module.exports = Orders