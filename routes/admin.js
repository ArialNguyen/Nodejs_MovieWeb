const express = require("express")
const Router = express.Router()
const movieFileRoute = require("./movieFiles")
const { default: axios } = require("axios")
const { StatusCodes } = require("http-status-codes")

Router.route("/").get(async (req, res) => {
    const {data: {genres: genre}} = await axios.get("http://localhost:5000/api/v1/genre")
    res.render('HomeManage', {user: req.user, genre})
})

Router.use("/Movie", movieFileRoute)

Router.route("/User").get(async (req, res) => {
    if(req.session.flassMessage){
        if(req.session.flassMessage.createUser){
            res.locals.sendMail = req.session.flassMessage.createUser
        }
        delete req.session.flassMessage
    }
    const {data: {success, users}} = await axios.get("http://localhost:5000/api/v1/user?userOnly=1", {headers: {Authorization: "Bearer " + req.cookies.accessToken}})
    res.render('ManageUser', {users, user: req.user})
})

// Router.route

Router.route("/Comment").get(async (req, res) => {
    const {data: {movies}} = await axios.get("http://localhost:5000/api/v1/movie?active=trailer,poster")
    res.render('ManageComment', {movies, user: req.user})
})

Router.route("/Comment/:movieId").get(async (req, res) => {
    const { data: { comments, success: successCmt } } = await axios.get(`http://localhost:5000/api/v1/comment?movieId=${req.params.movieId}&sort=-createdAt`)
    if (!successCmt) return res.status(StatusCodes.BAD_REQUEST).json({ success: false })
    
    const userId = comments.map(item => item.createdBy)
    const { data: { users, success } } = await axios.post(`http://localhost:5000/api/v1/user/getUsers`, { userId }, {headers: {Authorization: "Bearer " + req.cookies.accessToken}})
    if (!success) return res.status(StatusCodes.BAD_REQUEST).json({ success: false })

    const { data: { movie, success: successMovie } } = await axios.get(`http://localhost:5000/api/v1/movie/${req.params.movieId}`)
    if (!successMovie) return res.status(StatusCodes.BAD_REQUEST).json({ success: false })

    for (let i = 0; i < comments.length; i++) {
        console.log(users.find(item => item._id == comments[i].createdBy));
        comments[i].name = users.find(item => item._id == comments[i].createdBy).username
    }
    res.render('DetailCommentFilm', { comments, movie, user: req.user})
})
 
module.exports = Router