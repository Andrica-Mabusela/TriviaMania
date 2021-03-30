const mongoose = require('mongoose')

// create a schema
const UserSchema = new mongoose.Schema({

    facebookId: {
        type: String,
        default: ''
    },

    twitterId: {
        type: String,
        default: ''
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        default: 'user pass'
    },

    date: {
        type: Date,
        default: Date.now
    }
    
})

// create the model
const User = mongoose.model('User', UserSchema)

// export the model
module.exports = User