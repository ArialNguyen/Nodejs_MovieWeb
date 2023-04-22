const express = require("express")
const Router = express.Router()
const {createComment, getComments, deleteComment} = require("../controllers/comment")
const { authentication, isAdmin } = require("../middleware/auth")

Router.route("/").post(authentication, createComment).get(getComments)

Router.route("/:id").delete([authentication, isAdmin], deleteComment)
module.exports = Router