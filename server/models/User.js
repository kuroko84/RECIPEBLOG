const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    email: { 
        type: String,
        required: 'This fild is requied'
    },
    name: {
        type: String,
        required: 'This fild is requied'
    },
    dob: {
        type: Date,
        required: 'This fild is requied'
    },
    tel:{
        type: String,
        required: 'This fild is requied'
    }
});

module.exports = mongoose.model('User', userSchema);
