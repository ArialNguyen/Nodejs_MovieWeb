const {StatusCodes} = require("http-status-codes")
const CustomApiError = require("./CustomApiError")
class Unauthentication extends CustomApiError {
    constructor(mes){
        super(mes)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = Unauthentication