// Lib
const jwt = require("jsonwebtoken")

const getUser = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        return {success: true, user: decoded}
    } catch (e) {
        return {success: false}
    }
}

module.exports = {getUser} 