const Comment = require("../models/Comment")
const {BadRequest} = require("../errors/AllError")
const {StatusCodes} = require("http-status-codes")
const createComment = async (req, res)=>{
    req.body.username = req.user.username
    req.body.createdBy = req.user._id
    const comment = await Comment.create(req.body)
    if(!comment) throw new BadRequest("Information must be full fill")
    res.status(StatusCodes.CREATED).json({success: true, comment, user: req.user})
}
const getComments = async (req, res) => {
    const {movieId, sort} = req.query
    let execObj = {}
    if(movieId){
        execObj["movieId"] = {$eq: movieId}
    }
    let result = Comment.find(execObj)
    if(sort){
        const eleSort = sort.split(",").join(" ")
        result = result.sort(eleSort)
    }
    const comments = await result
    if(!comments) return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg : "Something wrong when get all comment by spetific movie"})
    res.status(StatusCodes.OK).json({success: true, comments, nbHits: comments.length})
}

const deleteComment = async (req, res) => {
    const comment = await Comment.findOneAndDelete({_id: req.params.id})
    if(!comment) return res.status(StatusCodes.BAD_REQUEST).json({success: false})
    res.status(StatusCodes.OK).json({success: true})
}
module.exports = {createComment, getComments, deleteComment}