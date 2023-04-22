// get models
const { default: mongoose } = require("mongoose")
const Rating = require("../models/Rating");
const { StatusCodes } = require("http-status-codes");
const { default: axios } = require("axios");

// Lib
const getTotalRatingofMovie = async (req, res) => {
    let {movieId} = req.query
    if(movieId){
        const total = await Rating.aggregate([
            {$match: { $expr : { $eq: [ '$moiveId' , { $toObjectId: movieId} ] } }},
            {
                $group: {_id: "$movieId", total: { $sum: "$rating_num" }, count: {$sum: 1}} 
            }
        ])
        if(!total[0]){
            return res.status(StatusCodes.OK).json({success: false, msg: "Movie dont have rating yet"}) 
        }
        total[0].avg = ((total[0].total / total[0].count)*2).toFixed(1);
        delete total[0]._id
        return res.status(StatusCodes.OK).json({success: true, total: total[0]})   
    }
    res.status(StatusCodes.CONTINUE).json({success: false, msg: "API NOT FINISHED YET"})
}

const createRating = async (req, res) => {
    let userId = req.user._id
    let movieId = req.query.movieId
    let star = req.query.star
    let rating_check = await Rating.findOneAndUpdate({userId: userId, moiveId: movieId}, {
      rating_num: star
    })
    if(!rating_check){
      console.log("chua rating");
      rating_check =  await Rating.create({rating_num: star, userId, moiveId: movieId})
    }
    console.log("rating");
    const {data: {success, total}} = await axios.get(`http://localhost:5000/api/v1/rating?movieId=${movieId}`)
    if(success){ // Update rating total of movie
      console.log(total);
      console.log(movieId, star);
      const {data: {success: sc}} = await axios.patch(`http://localhost:5000/api/v1/movie/${movieId}?avg_rating=1`, {avg_Rating: total.avg}, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${req.cookies.accessToken}` }})
      if(sc){
        return res.status(StatusCodes.OK).json({success: true})
      }
    }
    return res.status(StatusCodes.NO_CONTENT).json({success: false})
}

module.exports = {getTotalRatingofMovie, createRating}