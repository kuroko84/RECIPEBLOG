const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This fild is requied'
    },
    image: {
        type: String,
        required: 'This fild is requied'
    }
});

module.exports = mongoose.model('Category', categorySchema);
