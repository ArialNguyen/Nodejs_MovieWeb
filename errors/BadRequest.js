const {StatusCodes} = require("http-status-codes")
const CustomApiError = require("./CustomApiError")
class BadRequest extends CustomApiError {
    constructor(mes){
        super(mes)
        this.statusCode = StatusCodes.BadRequest
    }
}

module.exports = BadRequest