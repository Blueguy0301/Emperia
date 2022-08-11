const router = require('express-promise-router')()
const Admin = require('../db/admin')
const db = require('../db/db')
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
//! /api/admin
//* read contact support
router.get('/contact', async (req, res, next) => {
  const data = await Admin.GetSupport(req.session.userId)
  res.send(data)
})
router.get('/bug', async (req, res, next) => {
  const data = await Admin.GetBug(req.session.userId)
  res.send(data)
})
//* implement this last
router.post('/notif', async (req, res, next) => {
  console.log('notification router post ran')
  const data = await Admin.AddNotification(req.session.userId, req.body)
  res.send(data)
})
//* read bug reports
router.get('/bugs', async (req, res, next) => {
  const data = await Admin.GetBug(req.session.userId)
  res.send(data)
})
//* adds an admin account
router.post('/add', async (req, res, next) => {
  const { UID, Level } = req.body
  const data = await Admin.AddAdmin(req.session.userId, { UID, Level })
})
//* creates a new section
router.post('/create', async (req, res, next) => {
  console.log(req.body)
  const { section } = req.body
  const data = await Admin.SaveSection(req.session.userId, {
    sectionName: section,
  })
  console.log(data)
  res.send(data)
  // const data = await db.CreateSection(req.session.userId)
})
//* gets all sections (on admin db)
router.get('/section', async (req, res, next) => {
  const data = await Admin.GetSection(req.session.userId)
  res.send(data)
})
//* get all events
router.get('/all', async (req, res, next) => {
  const id = req.session.userId,
    isAuth = req.session.isAuth
  let event = []
  const { Admin, Events } = await db.GetAllEvents(id)
  if (Admin) {
    for (let i in Events) {
      event[i] = {
        EventName: Events[i].EventName,
        StartingDate: Events[i].StartingDate,
        EndingDate: Events[i].EndingDate,
        Description: Events[i].Description,
        EventType: Events[i].EventType,
        photo: Events[i].toObject().photo,
        code: Events[i].InviteCode,
      }
    }
    res.send({ event, empty: Events.length === 0 })
  } else {
    res.send({ Admin: false })
  }
})
//* gets all users
router.get('/users', async (req, res, next) => {
  let curBatchNum = req.query.pageNumber || 1
  let perRequest = 50
  let data = await db.GetAllUsers(req.session.userId, curBatchNum, perRequest)
  const query = data.Users?.map(data => {
    // console.log(data)
    return {
      id: data._id,
      name: data.DisplayName,
      section: data.section ? data.section : 'No Section',
      Level: data.Level,
    }
  })
  res.send({ query, total: data.totalPages })
})
//* updates user's info/section
router.post('/update', (req, res, next) => {
  console.log('post update called')
  const { params, _id } = req.body
  const { userId } = req.session
  console.log(req.body)
  db.UpdateSection(userId, _id, params)
  res.send({ success: true })
})
//* deletes a section
router.post('/delete', async (req, res, next) => {
  const { params } = req.body
  const { userId } = req.session
  await Admin.DeleteSection(userId, params)
  res.send({ success: true })
})
module.exports = router
