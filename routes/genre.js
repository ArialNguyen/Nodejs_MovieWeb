const express = require("express")
const Router = express.Router()
const {getAllGenres, createGenre, getSingleGenre} = require("../controllers/genre")
const { authentication, isAdmin } = require("../middleware/auth")

Router.route("/").get(getAllGenres).post([authentication, isAdmin], createGenre)
Router.route("/:id").get(getSingleGenre)

module.exports = Router