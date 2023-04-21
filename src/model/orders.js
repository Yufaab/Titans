const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    rank: {
        type: Number,
        trim: true,
        required: [true, "Please provide rank"],
        maxLength: 7,
        minLength: 1
    },
    category: {
        type: String,
        trim: true,
        required: [true, "Please choose your category"],
    },
    gender: {
        type: String,
        required: false,
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
        index: true
    }
},{
    timestamps: true
})

const Orders = mongoose.model('Orders',orderSchema)

module.exports = Orders