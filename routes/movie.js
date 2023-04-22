const express = require("express")
const Router = express.Router()
const { default: axios } = require('axios');
const {isAdmin, authentication} = require("../middleware/auth")
const {getMovieById, getAllmovie, createMovie, deleteMovie, updateMovie, createField} = require("../controllers/movie");

Router.route("/").get( getAllmovie).post([authentication, isAdmin], createMovie)

Router.route("/:id").get(getMovieById).post([authentication, isAdmin], createField).patch([authentication], updateMovie).delete([authentication, isAdmin], deleteMovie)


module.exports = Router 