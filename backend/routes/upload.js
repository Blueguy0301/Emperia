const router = require('express-promise-router')()
const graph = require('../auth/graph')
const fileUpload = require('express-fileupload')
const db = require('../db/db')
const csv = require('csv-parser')
const fs = require('fs')
//* cors
const cors = require('cors')
router.use(
  cors({
    origin: [
      'https://emperia.online',
      'https://beta.emperia.online',
      'https://www.emperia.online',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    header: {
      'Access-Control-Allow-Credentials': true,
    },
  })
)
router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/var/www/api.emperia.online/temp',
    debug: true,
  })
)
// todo :  add a send after success
//this is broken. fix this
router.post('/file', async (req, res, next) => {
  console.log('file upload called')
  console.log(req.files)
  const { code } = req.body
  // console.log(code)
  if (!req.session.isAuth) {
    res.sendStatus(401)
    return
  }
  //get file
  const { StorageLink } = await db.GetLink(code)
  const Result = await graph.UploadSubmission(
    req.app.locals.msalClient,
    req.session.userId,
    req.files.file,
    StorageLink,
    code
  )
  if (Result) {
    //remove file from memory
    res.send({ Success: true })
  } else {
    res.send({ Success: false })
  }
  req.files.file = null
})
router.post('/csv', async (req, res, next) => {
  console.log('csv has ran')
  // const Delete = req.query.Delete ?? false
  const Delete = req.query.Delete ?? false
  // console.log(req)
  console.log(Delete)
  const isAdmin = await db.checkAdmin(req.session.userId)
  if (!req.session.isAuth || !isAdmin) {
    res.sendStatus(401)
    return
  }
  const file = req.files.csv
  const tempFile = `${__dirname}/temp/${file.name}`
  await file.mv(tempFile)
  let data = []
  fs.createReadStream(tempFile)
    .pipe(csv())
    .on('data', row => {
      // console.log(row)
      if (
        row.firstName === '' &&
        row.LastName === '' &&
        row.mail === '' &&
        row.Section === '' &&
        row.Level === ''
      ) {
        return
      }
      data.push(row)
    })
    .on('end', async () => {
      let send =
        Delete == 'true'
          ? await db.csvRemoveUsers(data, req.session.userId)
          : await db.csvAddUser(data, req.session.userId)
      console.log(send)
      res.send(send)
      fs.unlink(tempFile, err => {
        if (err) {
          console.log(err)
        }
      })
    })
})

module.exports = router
