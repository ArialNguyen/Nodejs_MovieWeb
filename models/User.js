const mongoose = require("mongoose")
require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Users = new mongoose.Schema({
    Roles: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    username:{
        type: String,
        required: [true, "UserName must be required"],
        length: 50
    },
    email: {
        type: String,
        required: [true, "User email must be required"],
        length: 30,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            , 'Email not valid'
        ],
        unique: [true, "Already Exist this email"]
    },
    gender: {
        type: String,
        enum: ['female', 'male']
    },
    password: {
        type: String,
        required: [true, "Password must be required"],
    }
})
// Doing a task before save(for any instance method need to save operation). 
// Tất cả những cái này đều là sau khi tạo 1 đối tượng
Users.pre("save", async function (){
    const salt = await bcrypt.genSalt(10) // random bytes
    this.password =  await bcrypt.hash(this.password, salt)
})
// Create function in Users Chema
Users.methods.createToken = function (){ // arrow function dont have this keyword
    const token = jwt.sign({_id: this.id, username: this.username, Roles: this.Roles}, process.env.JWT_SECRET)
    return token
}
Users.methods.HashedAndCompared_Password = async function (Password){ // arrow function dont have this keyword
    const result = await bcrypt.compare(Password, this.password)
    return result
}

module.exports = mongoose.model("Users", Users)