const mongoose = require("mongoose")
require("dotenv").config()

const ratingSchema = new mongoose.Schema({
    rating_num: {
        type: Number,
        min: [1,"The lowest rating is 1"],
        max: 5
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    moiveId: {
        type: mongoose.Types.ObjectId,
        ref: "Movie"
    }
}, {timestamps: true})

module.exports = mongoose.model("Rating", ratingSchema)