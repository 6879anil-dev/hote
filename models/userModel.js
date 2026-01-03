const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    tc: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    emailActive: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    gun: {
        type: Number,
        default: 0
    },
    baslangic: {
        type: Date
    },
    bitis: {
        type: Date
    },

}, {collection: "users", timestamps: true});

const User = mongoose.model("User", UserSchema);

module.exports = User;