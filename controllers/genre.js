const Genre = require("../models/Genre")
const {StatusCodes} = require("http-status-codes")

const getAllGenres = async (req, res) => {
    const genres = await Genre.find({})
    res.status(StatusCodes.OK).json({genres, nbHits: genres.length})
}
const createGenre = async (req, res) => {
    const genres = await Genre.create(req.body)
    res.status(StatusCodes.CREATED).json({success: true, genres})
}
const getSingleGenre = async (req, res) => {
    const genre = await Genre.findOne({_id: req.params.id})
    if(!genre) return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: `Not found genre with id = ${req.params.id}`})
    res.status(StatusCodes.OK).json({success: true, genre})
}

module.exports = {getAllGenres, createGenre, getSingleGenre}