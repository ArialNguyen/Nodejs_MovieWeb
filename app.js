require("dotenv").config()
require("express-async-errors")
const express = require("express")
const session = require("express-session")
const cookieParser = require('cookie-parser')
const { engine } = require("express-handlebars")
const {removeVietnameseTones} = require("./parseURL")
const app = express()

app.use(cookieParser())
app.use(express.static(__dirname + "/public"))
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));

app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: 'somesecret',
        cookie: { maxAge: 60000*5 }
    }))
    // view engine setup
app.engine('.hbs', engine({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        plus: function(index) {
            return parseInt(index) + 1;
        },
        changeURL: function(text){
            return removeVietnameseTones(text)
        },
        compareUserId: function(userid_cmt, userid) {
            return userid_cmt == userid
        },
        eq: function(a, b, opts) {
            if (a == b) {
                return opts.fn(this)
            } else {
                return opts.inverse(this)
            }
        },
        neq: function(a, b) {
            if (parseInt(a) != parseInt(b)) {
                return true
            } else {
                return false
            }
        },
        isUnderfined: function(a) {
            return (typeof a == "undefined")?true:false
        },
    }
}));

app.set('view engine', 'hbs')
app.set("views", "./views")
app.set('view engine', 'hbs');

// Extra security packages
// const helmet = require("helmet")
// const xssClean = require('xss-clean')
// const cors = require("cors") 

// get Connection
    // const product = require("./models/products")

// Get Handling MiddleWare 
const authRoute = require("./routes/auth")
const movieRoute = require("./routes/movie")
const genreRoute = require("./routes/genre")
const adminRoute = require("./routes/admin")
const commentRoute = require("./routes/comment")
const userRoute = require("./routes/user")
const ratingRoute = require("./routes/rating")
const movieRoute_client = require("./routes/movie_client")
const { errorHandler } = require("./middleware/errorHandler")
const { default: axios } = require("axios")
const { authentication, isAdmin} = require("./middleware/auth")

// MiddleWare
    // app.use(helmet)
    // app.use(xssClean)
    // app.use(cors)
    // app.use(rateLimitter)
    // app.use(express.static("./public"))

app.use((req, res, next) => {
    if(req.cookies.accessToken){
        req.headers.authorization = 'Bearer ' + req.cookies.accessToken
    }
    next()
})

// Home route
app.get("/", authentication, async (req, res) => {
    const {data: {movies: hotMovies}} = await axios.get("http://localhost:5000/api/v1/movie?active=trailer,poster&limit=4&hotFilms=8&sort=-avg_Rating")
    const {data: {movies: comming_soon}} = await axios.get("http://localhost:5000/api/v1/movie?status=comming_soon&active=trailer,poster&limit=12")
    const {data: {movies: not_full}} = await axios.get("http://localhost:5000/api/v1/movie?status=not_full&active=trailer,poster&limit=12")
    const {data: {genres: genre}} = await axios.get("http://localhost:5000/api/v1/genre")
    const {data: {movies: full}} = await axios.get("http://localhost:5000/api/v1/movie?status=full&active=trailer,poster&limit=12")
    const {data: {genres: genrelist}} = await axios.get("http://localhost:5000/api/v1/genre")

    // console.log(hotMovies);

    res.render('HomePage', {comming_soon, not_full, hotMovies, genre, user: req.user, full, genrelist})
})

// Get routes User
app.get("/login", authentication ,(req, res, next) => {
    if(req.session.flashMessage){
        if(req.session.flashMessage.msg){
            res.locals.msg = req.session.flashMessage.msg
        }
        if(req.session.flashMessage.email_expired){
            res.locals.email_expired = req.session.flashMessage.email_expired
        }
        delete req.session.flashMessage
    }
    next()
}, (req, res) => {
    res.render('Login', {layout: false})
})
app.get('/logout', (req, res) => {
    res.clearCookie("accessToken")
    res.redirect("/")
})
app.get('/register', authentication, (req, res, next) => {
    if(req.session.flashMessage){
        if(req.session.flashMessage.success_register){
            res.locals.success_register = req.session.flashMessage.success_register
        }
        delete req.session.flashMessage
    }
    next()
},(req, res) => {
    res.render('register', {layout: false})
})
// Client 
app.use("/movie", movieRoute_client) // no authen
// API
app.use("/api/v1/auth", authRoute) // no authen
    // API route User
app.use("/api/v1/user", [authentication, isAdmin], userRoute) // 
    // Get routes Movie
app.use("/api/v1/movie", movieRoute) 
    // Get routes genre
app.use("/api/v1/genre", genreRoute) // Done
    // Get routes Comment 
app.use("/api/v1/comment", commentRoute) // Done
    // Get routes ratings
app.use("/api/v1/rating", ratingRoute) // Done

// Admin route
app.use("/HomeManage", [authentication, isAdmin], adminRoute)

// Not Found
app.use((req, res) => {
    res.render('404', {layout: false})
})
// Error Handling
app.use(errorHandler)

module.exports = app