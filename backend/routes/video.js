const router = require("express-promise-router")(),
  fs = require("fs")
//! /video
router.get("/:event/:name", (req, res) => {
  if (!req.session.isAuth) {
    res.sendStatus(401)
    return
  }
  let {event, name} = req.params
  event = event.toLowerCase()
  name = name.toLowerCase()
  const videoPath = `/mnt/emperia-storage/video/${event}/${name}`
  fs.readFile(videoPath, (err, data) => {
    if (err) {
      res.sendStatus(404)
      return
    }
  })
  res.sendFile(videoPath)
})

module.exports = router
