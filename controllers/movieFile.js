const fs = require("fs");
const multer = require("multer")
const { fileIcon, fileType } = require("../FileType");
const path = require('path');
const { StatusCodes } = require("http-status-codes")
const { removeVietnameseTones } = require("../parseURL")
// const uploader = multer({ dest: __dirname + "/../Uploads/" })
// Models
const Movie = require("../models/Movie")

// Controllers
const getAllFiles = async (req, res) => {
    const movie = await Movie.findById({ _id: req.params.id })
    if (!movie) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, msg: `Not Found movie with id = ${req.parmas.id}` })
    let root = path.join(__dirname, "../Upload", movie.name)
    if (fs.existsSync(root)) {
        let { dir } = req.query
        let movieRoot = root
        if (dir) {
            movieRoot += "\\" + dir
        }
        let arr = []
        await fs.readdirSync(movieRoot).forEach(item => { 
            let path_file = movieRoot + "/" + item
            if (movieRoot.endsWith("/")) {
                path_file = movieRoot + item
            }
            let obj = {}
            let tmp = fs.statSync(path_file)
            let subPath = path_file.replace(root, '')
            if (tmp.isDirectory()) {
                if (subPath.startsWith("/") || subPath.startsWith("\\")) {
                    subPath = `?dir=${subPath.substring(1)}`
                } else {
                    subPath = `?dir=${subPath}`
                } 
            }
            obj[`${item}`] = {
                "path": path_file,
                "LastModified": `${tmp.mtime.getDay()}-${tmp.mtime.getMonth()}-${tmp.mtime.getFullYear()}`,
                "Type": fileType[path.extname(item)] || "Order",
                "Icon": fileIcon[path.extname(item)] || '<i class="bi bi-file"></i>',
                "Size": (tmp.isDirectory()) ? "-" : parseFloat((tmp.size / (1024 ** 2))).toFixed(2),
                "SubPath": subPath
            }
            arr.push(obj)
        })
        return res.status(StatusCodes.OK).json({ success: true, data: {listFile: arr, movieName: movie.name} })
    }

}

module.exports = { getAllFiles }