const jwt = require("jsonwebtoken")
const {Unauthentication, BadRequest, CustomApiError} = require("../errors/AllError");
const { StatusCodes } = require("http-status-codes");
const authentication = (req, res, next) => {
    let url = req.protocol + '://' + req.get('host') + req.originalUrl
    url = url.substring(url.indexOf("5000") + 4)
    if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")){
        if( url == "/login" || url == "/register" || url == "/" || new RegExp("/movie/([a-z0-9]+)").test(url) ){
            return next()
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({success: false, msg: ""})
    }
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        if(req.url == "/login" || req.url == "/register"){
            return res.redirect("/")
        }
        next()
    } catch (error) {
        throw new CustomApiError(error.message) 
    }
}

const isAdmin = (req, res, next) => {
    if(!req.user || req.user.Roles != "admin") {return res.render('AccessDenied')}
    next()
}


module.exports = {authentication, isAdmin}