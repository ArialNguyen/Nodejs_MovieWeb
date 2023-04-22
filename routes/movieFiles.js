const express = require("express")
const Router = express.Router()
const { getAllFiles } = require("../controllers/movieFile")
const { default: axios } = require('axios');

Router.route("/").get(async (req, res) => {
    const {data: {movies: movies}} = await axios.get("http://localhost:5000/api/v1/movie?active=trailer,poster")
    const {data: {genres: genre}} = await axios.get("http://localhost:5000/api/v1/genre")
    res.render('ManageMovie', {movies, genre, user: req.user})
})

Router.route("/:id").get(async (req, res) => {
    const {data: {movie: movie}} = await axios.get(`http://localhost:5000/api/v1/movie/${req.params.id}`)
    const {data: {genres: genre}} = await axios.get("http://localhost:5000/api/v1/genre")

    res.render('ManageDataMovie', {movie, user: req.user, genre})
})

module.exports = Router