const express = require("express")
const Router = express.Router()
const {getAllUsers, createUser, removeUser, getUsersByCondition, getSingleUser} = require("../controllers/user")

Router.route('/').get(getAllUsers).post(createUser)
Router.route("/getUsers").post(getUsersByCondition)
Router.route('/:id').delete(removeUser).get(getSingleUser)

module.exports = Router