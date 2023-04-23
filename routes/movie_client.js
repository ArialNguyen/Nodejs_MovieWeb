const { default: axios } = require("axios")
const express = require("express")
const { StatusCodes } = require("http-status-codes")
const {getUser} = require("../lib/getUserByToken")
const Router = express.Router()

Router.route("/").get(async (req, res) => {
    if(req.cookies.accessToken){
        const {success, user} = getUser(req.cookies.accessToken)
        if(success){
            req.user = user
        }
    }
    const {genre, newMovie, hot, phimhay, series, oneep, name} = req.query
    let {data: {genres: genrelist}} = await axios.get(`https://arial-movie.herokuapp.com/api/v1/genre`)
    if(genre){
        const {data: {movies: movies}} = await axios.get(`https://arial-movie.herokuapp.com/api/v1/movie?active=trailer,poster&limit=6&genre=${genre}`)
        const {data: {genre: genreName}} = await axios.get(`https://arial-movie.herokuapp.com/api/v1/genre/${genre}`)
        res.render('Find', {movies, genreName, genrelist, user: req.user})
    }else if(newMovie){
        const {data: {movies: movies}} = await axios.get(`https://arial-movie.herokuapp.com/api/v1/movie?status=not_full&active=trailer,poster`)
        const genreName = {name: "Mới"}
        res.render('Find', {movies, genreName, genrelist, user: req.user})
    }else if(hot){
        const {data: {movies: movies}} = await axios.get(`https://arial-movie.herokuapp.com/api/v1/movie?active=trailer,poster&hotFilms=8`)
        res.render('Find', {movies, genreName: {name: "Hot"}, genrelist, user: req.user})
    }else if(phimhay){
        const {data: {movies: movies}} = await axios.get(`https://arial-movie.herokuapp.com/api/v1/movie?active=trailer,poster`)
        res.render('Find', {movies, genreName: {name: "Hay"}, genrelist, user: req.user})
    }else if (series || oneep){
        let {data: {movies: movies}} = await axios.get(`https://arial-movie.herokuapp.com/api/v1/movie?active=trailer,poster`)
        if(series){
            movies = movies.filter(item => item.episodes.length > 1)
        }
        if(oneep){
            movies = movies.filter(item => item.episodes.length == 1)
        }
        let name = (series)?"Bộ":"LẺ"
        res.render('Find', {movies, genreName: {name}, genrelist, user: req.user})
    }else if(name){
        let {data: {movies}} = await axios.get(`https://arial-movie.herokuapp.com/api/v1/movie?active=trailer,poster&name=${name}`)
        res.render('Find', {movies, genreName: {key: name}, genrelist, user: req.user})
    }else{
        res.status(StatusCodes.CONTINUE).end("WE ARE UPDATED")
    }
})

Router.route("/:id").get(async (req, res) => {
    if(req.cookies.accessToken){
        const {success, user} = getUser(req.cookies.accessToken)
        if(success){
            req.user = user
        }
    }
    const {data: {movie: movie}} = await axios.get(`https://arial-movie.herokuapp.com/api/v1/movie/${req.params.id}?activeLink=1`)
    const {data: {genre: genreName}} = await axios.get(`https://arial-movie.herokuapp.com/api/v1/genre/${movie.genre}`)
    const {data: rating} = await axios.get(`https://arial-movie.herokuapp.com/api/v1/rating?movieId=${req.params.id}`)
    const {data: {genres: genre}} = await axios.get("https://arial-movie.herokuapp.com/api/v1/genre")
    let {data: {genres: genrelist}} = await axios.get(`https://arial-movie.herokuapp.com/api/v1/genre`)
    res.render('DetailMovie', {movie, genreName, rating: rating.total, user: req.user, genre, genrelist})
})

Router.route("/:id/:epName").get(async (req, res) => {
    if(req.cookies.accessToken){
        const {success, user} = getUser(req.cookies.accessToken)
        if(success){
            req.user = user
        }
    }
    const {epName, id} = req.params
    let {data: {genres: genrelist}} = await axios.get(`https://arial-movie.herokuapp.com/api/v1/genre`)
    // console.log(epName, id)
    const {data: {link: link, movie: movie}} = await axios.get(`https://arial-movie.herokuapp.com/api/v1/movie/${id}?epName=${epName}`)
    const { data: { comments, success: successCmt } } = await axios.get(`https://arial-movie.herokuapp.com/api/v1/comment?movieId=${id}&sort=1`)
    const {data: {movies: hotMovies}} = await axios.get("https://arial-movie.herokuapp.com/api/v1/movie?active=trailer,poster&hotFilms=8")
    const {data: {movies: comming_soon}} = await axios.get("https://arial-movie.herokuapp.com/api/v1/movie?active=trailer,poster&status=comming_soon")
    const {data: {movies: genreSame}} = await axios.get(`https://arial-movie.herokuapp.com/api/v1/movie?active=trailer,poster&limit=6&genre=${movie.genre}`)
    const {data: {genres: genre}} = await axios.get("https://arial-movie.herokuapp.com/api/v1/genre")
    res.render('WatchMovie', {link, movie, comments, totalCMT: comments.length, hotMovies, comming_soon, genreSame, user: req.user, genre, genrelist})
})

module.exports = Router
