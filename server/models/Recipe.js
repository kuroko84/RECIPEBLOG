const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This fild is requied'
    },
    description: {
        type: String,
        required: 'This fild is requied'
    },
    email: {
        type: String,
        required: 'This fild is requied'
    },
    ingredients: {
        type: Array,
        required: 'This fild is requied'
    },
    category: {
        type: String,
        enum: ['Thai', 'American', 'Chinese', 'Mexican', 'Indian', 'Spanish', 'Viet Nam'],
        required: 'This fild is requied'
    },
    image_url: {
        type: String,
        required: 'This fild is requied'
    },
    cloudinary_id:{
        type: String,
        required: 'This fild is requied'
    }
});

recipeSchema.index({ name: 'text', description: 'text'});


//wildcard indexing

//recipeSchema.index({ "$**":'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
