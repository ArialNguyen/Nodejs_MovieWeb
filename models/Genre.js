const mongoose = require("mongoose")
require("dotenv").config()

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model("Genre", genreSchema)