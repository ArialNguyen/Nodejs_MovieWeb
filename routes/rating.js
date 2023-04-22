const express = require("express")
const Router = express.Router()
const { default: axios } = require('axios');

const {getTotalRatingofMovie, createRating} = require("../controllers/rating");
const { authentication } = require("../middleware/auth");

Router.route("/").get(getTotalRatingofMovie).post(authentication, createRating)


module.exports = Router 