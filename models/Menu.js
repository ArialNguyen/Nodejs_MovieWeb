const mongoose = require("mongoose")
require("dotenv").config()

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model("Menu", menuSchema)