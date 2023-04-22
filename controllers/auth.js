const User = require("../models/User")
const {StatusCodes} = require('http-status-codes')
const {CustomApiError, BadRequest, Unauthentication} = require("../errors/AllError")
const {sendMail} = require("../controllers/mail")
const {sign_up} = require('../lib/mail_body')
const jwt = require("jsonwebtoken")
const register = async (req, res) => {
    // mongoose checked validtion
    const {username, email, gender, password} = req.body
    if(!username || !email || !gender || !password){
        return res.json({msg: "fail"})
    }
    const user_check = await User.findOne({email})
    if(user_check){
        return res.json({success: false, msg: `Email ${email} already exist`})
    }
    let status = await sendMail(email, username, "Signup | Verification", sign_up(email, ""))
    if (status){
        throw new Error("Fail to send Mail")
    }
    let token = {}
    if(req.cookies.rg_store){
        token = JSON.parse(req.cookies.rg_store)
    }
    token[email] = jwt.sign({username, email, gender, password}, process.env.JWT_SECRET)
    res.cookie("rg_store", JSON.stringify(token), {overwrite: true})
    req.session.flashMessage = {success_register: "Success Register"}
    return res.json({success: true, msg: "Check your Email"})
}

const verify = async (req, res) => {
    const {email, crb} = req.query
    if (!email) return res.status(StatusCodes.BAD_GATEWAY).json({success: false})
    if(req.cookies.rg_store && crb == "" && !req.session[`rg_${email}`]){
        let obj = JSON.parse(req.cookies.rg_store)
        if(obj[email]){
            try {
                let body = jwt.verify(obj[email], process.env.JWT_SECRET)
                body.Roles = "user"
                const user = await User.create(body)
                if(!user){
                    throw new CustomApiError("FAil to create user")
                }
                delete obj[email]
                res.cookie("rg_store", JSON.stringify(obj), {overwrite: true})
            } catch (e) {
                req.session.flashMessage['email_expired'] = true
            }
            return res.redirect("/login")
        }
    }else{
        try {
            let body = jwt.verify(req.session[`rg_${email}`], process.env.JWT_SECRET)
            console.log(body);
            const user = await User.create(body)
            if(!user){
                throw new CustomApiError("FAil to create user")
            }
            delete req.session[`rg_${email}`]
            
        } catch (e) { // Expired Email
            req.session.flashMessage = {email_expired: true}
        }
        return res.redirect("/login")
    }
}

const login = async (req, res) => {
    // decoded Password
    const {email, password} = req.body
    if(!email || !password){ 
        throw new CustomApiError("This information must be fullfill")
    } 
    const user = await User.findOne({email})
    if(!user) {
        return res.json({success: false, msg: "Wrong Information"})
    }
    const result = await user.HashedAndCompared_Password(password)
    if(!result){
        return res.json({success: false, msg: "Wrong Information"})
    }
    const token = user.createToken()
    res.cookie("accessToken", token)
    if(user.Roles == "admin"){
        return res.status(StatusCodes.OK).json({success: true, redirect: "/HomeManage" , msg: "Login success"})
    }
    res.status(StatusCodes.OK).json({success: true, redirect : "/", msg: "Login success"})
    // res.status(StatusCodes.OK).redirect('/')
}
 
module.exports = {login, register, verify}