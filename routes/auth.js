const express = require("express")
const Router = express.Router()
const {login, register, verify} = require("../controllers/auth")

Router.route("/login").post(login)
Router.route("/register").post(register)
Router.route("/verify").get(verify)

module.exports = Router