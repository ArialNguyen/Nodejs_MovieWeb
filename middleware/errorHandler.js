const { StatusCodes } = require("http-status-codes")

const errorHandler = (err, req, res, next) => {
    // Check Mongoose Error
    console.log(err);
    let customError = {
        message: err,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    }
    if(err.name === "ValidationError"){
        customError.message = `${Object.keys(err.errors).join(", ")} must be required`
        customError.statusCode = 400
    }
    if(err.code && err.code === 11000){
        customError.message = `${Object.keys(err.keyValue).join(", ")} was Duplicated`
        customError.statusCode = 400
    }
    if(err.name === "CastError"){
        customError.message = `No item for this id ${err.value}`
        customError.statusCode = 404
    }
    res.status(customError.statusCode).json({customError})
}

module.exports = {errorHandler}