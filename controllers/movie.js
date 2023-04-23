// Models
const Movie = require("../models/Movie")
// Lib
const { StatusCodes } = require("http-status-codes")
const BadRequest = require("../errors/BadRequest");
const {removeVietnameseTones} = require("../parseURL");

// Movie
const getAllmovie = async (req, res) => {
  const { genre, hotFilms, status, active, limit, sort, name} = req.query
  let execObj = {}
  if (genre) {
    execObj["genre"] = { $eq: genre }
  }
  if(name){
    execObj["name"] = {$regex: name, $options: 'i'} 
  }
  if (hotFilms) {
    execObj["avg_Rating"] = {$gte: hotFilms}
  }
  if (status) {
    execObj['status'] = status
  }

  let result = Movie.find(execObj)
  if (limit){
    result = result.limit(limit)
  }
  if(sort){
    const eleSort = sort.split(",").join(" ")
    result = result.sort(eleSort)
  }
  let movies = await result
  if (active) { // Get active poster or trailer of movies
    movies = movies.map(item => {
      item.trailer = item.trailer.filter(item => (item.active) ? true : false)
      item.poster = item.poster.filter(item => (item.active) ? true : false)
      return item
    })
  }
  res.status(StatusCodes.OK).json({ movies, nbHits: movies.length })
}
const createMovie = async (req, res) => {
  let { name, genre, director, country, desc, trailer, poster, releaseDate } = req.body
  if (!name || !genre || !director || !country || !desc || !trailer || !poster ) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, msg: "Information must be fullfilled" })
  }
  if(releaseDate){
    req.body.releaseDate = new Date(releaseDate)
  }
  req.body.poster[0].active = true
  req.body.trailer[0].active = true
  req.body.status = 'comming_soon'
  const movie = await Movie.create(req.body)
  if (!movie) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, msg: "Error for create Films" })
  res.status(StatusCodes.CREATED).json({ success: true, movie })
}

const createField = async (req, res) => {
  const { field } = req.query
  const {url, name} = req.body
  if (!field) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, msg: "Please provie Field to create" })
  if (!url || !name) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, msg: "Please provie information to create" })
  const movie = await Movie.findOneAndUpdate({ _id: req.params.id }, {
    $addToSet: {
      [field]: {
        link: url,
        name
      }
    }
  }, { new: true })
  if(field == "episodes" && movie.status == "comming_soon"){
    await Movie.findOneAndUpdate({_id: req.params.id}, {status: "not_full"})
  }
  if (!movie) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, msg: `Something error for create Field ${field}` })
  res.status(StatusCodes.CREATED).json({ success: true, movie })
}

const getMovieById = async (req, res) => {
  const { activeLink, epName} = req.query
  let movie = await Movie.findOne({ _id: req.params.id })
  if(epName){
    let link = movie.episodes.find(item => removeVietnameseTones(item.name) == epName).link
    return res.status(StatusCodes.OK).json({success: true, link, movie})
  }
  if (activeLink) { // Get only Link active of movie
    movie.trailer = movie.trailer.filter(item => (item.active) ? true : false)
    movie.poster = movie.poster.filter(item => (item.active) ? true : false)
  }
  if (!movie) return res.status(StatusCodes.BAD_REQUEST).json({ success: false })
  res.status(StatusCodes.OK).json({ success: true, movie })
}

const updateMovie = async (req, res) => {
  const {id, active, star, avg_rating, all} = req.query
  if( active && id){  
    let {acknowledged} = await Movie.updateMany({_id: req.params.id}, {
      $set: {
        [`${active}.$[all].active`] : false,
        [`${active}.$[one].active`]: true,
      }
    }, {arrayFilters: [
      {"all._id": {$ne: id}},
      {"one._id": id}
    ]})  
    if(!acknowledged) return res.status(StatusCodes.BadRequest).json({success: false, msg: `Error when updating active ${active}`})
    res.status(StatusCodes.OK).json({success: true})
  }else if(avg_rating){
    const mv = await Movie.findOneAndUpdate({_id: req.params.id}, req.body)
    if(!mv) return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: "Something error when update avg rating"})
    res.status(StatusCodes.OK).json({success: true})
  }else if(all){
    // let { name, genre, director, status, country, desc, releaseDate } = req.body
    const movie = await Movie.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
    if(!movie) return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: "Something error when update avg rating"})
    return res.status(StatusCodes.OK).json({success: true, movie})
  }
}

const deleteMovie = async (req, res) => { 
  const { field, id} = req.query
  if (field && id) {
    console.log(req.query)
    const movie = await Movie.findByIdAndUpdate(
      { _id: req.params.id},
      {
        $pull: {
          [field]: {_id: id}
        }
      }
    )
    if (!movie) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, msg: `Something error for delete Field ${field}` })
    return res.status(StatusCodes.OK).json({ success: true})
  }
  const movie = await Movie.findOneAndDelete({ _id: req.params.id })
  console.log(req.params.id)
  if (!movie) throw new BadRequest("Something wrong when delete movie")
  res.status(StatusCodes.OK).json({ success: true })
}

module.exports = { getAllmovie, createMovie, updateMovie, deleteMovie, getMovieById, createField}




