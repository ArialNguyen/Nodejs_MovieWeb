const mongoose = require("mongoose")
require("dotenv").config()

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: [true, "Comment content mush be required"]
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Sender mush be required"]
    },
    username: { 
        type: String,
        required: [true, "user name mush be required"]
    },
    movieId: {
        type: mongoose.Types.ObjectId,
        ref: "Movie",
        required: [true, "Movie mush be required"]
    }
}, {timestamps: true})

module.exports = mongoose.model("Comment", commentSchema)