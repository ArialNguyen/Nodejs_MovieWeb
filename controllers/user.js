// Models
const User = require("../models/User")
// lib
const {StatusCodes} = require("http-status-codes")
const {sendMail} = require("./mail")
const {sign_up} = require('../lib/mail_body')
const jwt = require("jsonwebtoken")
// controller
const getAllUsers = async (req, res) => {
    const {userOnly} = req.query
    let execObj = {}
    if(userOnly){
        execObj["Roles"] = 'user'
    }
    const users = await User.find(execObj).select("-password")
    if(!users) return res.status(StatusCodes.BAD_REQUEST).json({success: false})
    res.status(StatusCodes.OK).json({success: true, users})
}

const getUsersByCondition = async (req, res) => {
    const {userId} = req.body
    const users = await User.find({_id: {$in: userId}}).select("-password")
    if(!users) return res.status(StatusCodes.BAD_REQUEST).json({success: false})
    res.status(StatusCodes.OK).json({success: true, users})
}

const createUser = async (req, res) => {
    const user_check = await User.findOne({email: req.body.email})
    if(user_check) return res.json({success: false, msg: `Email ${req.body.email} already Exists`}) 
    let token = jwt.sign(req.body, process.env.JWT_SECRET)
    req.session[`rg_${req.body.email}`] = token
    let status = await sendMail(req.body.email, req.body.username, "Signup | Verification", sign_up(req.body.email, "crbadmin"))
    if (status) throw new Error("Fail to send mail")
    req.session.flassMessage = {createUser: req.body.email}
    res.status(StatusCodes.OK).json({success: true})
}

const removeUser = async (req, res) => {
    const user = await User.findByIdAndRemove({_id: req.params.id})
    if(!user) return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: `Not found user with id = ${req.params.id}`})
    res.status(StatusCodes.OK).json({success: true})
}
const getSingleUser = async (req, res) => {
    const user = await User.findById({_id: req.params.id})
    if(!user) return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: `Not found user with id = ${req.params.id}`})
    res.status(StatusCodes.OK).json({success: true, user})
}
module.exports = {getAllUsers, createUser, removeUser, getUsersByCondition, getSingleUser}