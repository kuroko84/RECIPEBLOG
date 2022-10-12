const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({

    email: { 
        type: String,
        required: 'This fild is requied'
    },
    password: {
        type: String,
        required: 'This fild is requied'
    }
    // loginAt: { 
    //     type: Date, 
    //     default: Date.now
    // },
    // logoutAt: { 
    //     type: Date, 
    //     default: Date.now
    // },
    // action: { 
    //     type: String, 
    //     default: 'System'
    // },
});

module.exports = mongoose.model('Login', loginSchema);
