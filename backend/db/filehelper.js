require('dotenv').config()
const Grid = require('gridfs-stream')
const multer = require('multer')
const crypto = require('crypto')
const path = require('path')
const { GridFsStorage } = require('multer-gridfs-storage')
const storage = new GridFsStorage({
  url: process.env.db_image,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err)
        const filename = buf.toString('hex') + path.extname(file.originalname)
        const fileInfo = {
          filename: filename,
          bucketName: 'banners',
        }
        resolve(fileInfo)
      })
    })
  },
})
//*create profile instance add it to  user schema (temp)
const profile = new GridFsStorage({
  url: process.env.db_image,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err)
        const filename = buf.toString('hex') + path.extname(file.originalname)
        const fileInfo = {
          filename: filename,
          bucketName: 'profile',
        }
        resolve(fileInfo)
      })
    })
  },
})
module.exports = multer({ storage })
