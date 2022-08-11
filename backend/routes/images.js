const router = require("express-promise-router")()
const mongoose = require("mongoose")
const Grid = require("gridfs-stream")
const conn = mongoose.createConnection(process.env.db_image, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
let gfs
conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection("banners")
})
router.get("/:name", (req, res, next) => {
  try {
    gfs.files.findOne({filename: req.params.name}, (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "No file exists",
        })
      }
      // Check if image
      if (file.contentType.includes("image")) {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename)
        readstream.pipe(res)
      } else {
        res.status(404).json({
          err: "Not an image",
        })
      }
    })
  } catch (e) {
    console.log("/images/:name error")
    console.log(e)
    res.send({Success: false})
  }
})
router.delete("/:name", async (req, res, next) => {
  try {
    gfs.remove({_id: req.params.id, root: "uploads"}, (err, gridStore) => {
      if (err) {
        return res.status(404).json({err: err})
      }
      res.redirect("/")
    })
    res.send({Success: true})
  } catch (e) {
    console.log("/images/:name error")
    console.log(e)
    res.send({Success: false})
  }
})

module.exports = router
