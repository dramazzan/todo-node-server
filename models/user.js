const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    login: {
        type: String,nm
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    }
})

const User = mongoose.model('User', UserSchema)


module.exports = User

