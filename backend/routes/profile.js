const router = require('express-promise-router')()
const db = require('../db/db')
const graph = require('../auth/graph')
//todo  : ADD A EXPIRATION COOKIE AND SET IT TO 5 HOURS
//! /api/profile/
//* cors
const cors = require('cors')
router.use(
  cors({
    origin: [
      'https://192.168.1.6:3000',
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
//*Get user info by id
router.get('/user', async (req, res, next) => {
  let id = req.session.userId
  let info = await db.GetUser(id)
  // console.log(info)
  let full_name = `${info.givenName} ${info.surname}`
  res.send(
    req.session.isAuth
      ? {
          found: true,
          Name: full_name,
          Level: info.Level,
          Mail: info.Mail,
          LastSeen: info.LastSeen,
          firstLogin: info.CreatedAt,
          section: info.section,
        }
      : {
          User: 'Unregistered',
          Level: false,
        }
  )
})
//*Get current user photo
router.get('/picture', async (req, res, next) => {
  const temp = await graph.getUserProfile(req.app.locals.msalClient, req.session.userId)
  console.log(req.session.userId)
  const arrayBuffer = await temp.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  res.send(buffer)
})
router.get('/:Mail', async (req, res, next) => {
  //! Cannot set headers after they are sent to the client @ 103
  const { Mail } = req.params
  const { isAuth, userId } = req.session
  let eMail = `${Mail}@alabang.sti.edu.ph`,
    Data,
    full_name
  if (isAuth) {
    Data = await db.GetProfile(userId, eMail)
    full_name = `${Data.givenName} ${Data.surname}`
    Data.Success &&
      res.send(
        req.session.isAuth
          ? {
              found: true,
              Name: full_name,
              Level: Data.Level,
              Mail: Data.Mail,
              LastSeen: Data.LastSeen,
              firstLogin: Data.CreatedAt,
              section: Data.section,
            }
          : {
              User: 'Unregistered',
              Level: false,
            }
      )
  }
})

//* photo
router.get('/:Mail/photo', async (req, res, next) => {
  const { Mail } = req.params
  const { isAuth, userId } = req.session
  let eMail = `${Mail}@alabang.sti.edu.ph`
  if (isAuth) {
    Data = await db.GetProfile(userId, Mail)
  }
  let photo = await graph.getProfilePhoto(req.app.locals.msalClient, req.session.userId, eMail)
  if (photo == null) {
    res.send({ noPhoto: true })
  } else {
    const arrayBuffer = await photo.arrayBuffer()
    const buffer = arrayBuffer && Buffer.from(arrayBuffer)
    console.log(buffer)
    res.send(buffer)
  }
})
module.exports = router
