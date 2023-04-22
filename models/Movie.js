const mongoose = require("mongoose")
require("dotenv").config()

const movieSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Movie's name must be required"],
    },
    genre:{
        type: mongoose.Types.ObjectId,
        ref: "Genre",
        required: [true, "Movie's genre must be required"],
    },
    director:{
        type: String,
        required: [true, "Movie's director must be required"],
    },
    country:{
        type: String,
        required: [true, "Movie's country must be required"],
    },
    status:{
        type: String,
        enum: ['full', 'not_full','comming_soon'],
        required: [true, "Movie's status must be required"],
    },
    trailer: [{
        name: String,
        link: String,
        active: {
            type: Boolean,
            default: false
        }
    }],
    poster: [{
        name: String,
        link: String,
        active: {
            type: Boolean,
            default: false
        }
    }],
    episodes: [{
        name: String,
        link: String
    }],
    desc:{
        type: String,
        required: [true, "Movie's description must be required"],
    },
    releaseDate: Date,
    actor: Array,
    avg_Rating: {
        type: Number
    }
}, {timestamps: true})  

module.exports = mongoose.model("Movie", movieSchema)