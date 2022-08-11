//* cors
const router = require('express-promise-router')(),
  db = require('../db/db'),
  graph = require('../auth/graph')
const cors = require('cors')
router.use(
  cors({
    origin: ['https://emperia.online', 'https://beta.emperia.online', 'https://www.emperia.online'],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    header: {
      'Access-Control-Allow-Credentials': true,
    },
  })
)
//* user routes
//*Get Greetings by id
//! /api/user
// post requestfor /users/accept
router.post('/accept', async (req, res, next) => {
  let id = req.session.userId
  //* add a eula accepted query
  let success = await db.UpdateUser(id, { PrivacyPolicy: true })
  res.send(success ? { success: true } : { success: false })
})
//* get user notifications
router.get('/notifications', async (req, res, next) => {
  let id = req.session.userId
  if (!req.session.isAuth) {
    res.sendStatus(401)
    return
  }
  let notifications = await db.GetUser(id)
  // console.log(notifications)
  res.send(notifications.notifications)
})
router.post('/read', async (req, res, next) => {
  let id = req.session.userId
  let { notification_id } = req.body
  let success = await db.updateNotif(id, notification_id)
  res.send(success ? { success: true } : { success: false })
})
router.delete('/notif-delete', async (req, res, next) => {
  let id = req.params.id
  let uid = req.session.userId
  let success = await db.DeleteNotif(uid, id)
  res.send(success ? { success: true } : { success: false })
})
router.get('/search', async (req, res, next) => {
  console.log('user search ran')
  const isAuth = req.session.isAuth
  let userData, eventData
  const query = req.query.s
  if (!isAuth) {
    res.status(401).send({ error: 'Unauthorized' })
  }
  const Events = await db.searchEvent(query)
  const users = await db.search(query)
  // console.log("events : ", Events)
  // console.log("users : ", users)
  if (users.found) {
    userData = users.data.map(user => ({
      Mail: user.Mail.split('@')[0],
      Name: user.DisplayName,
      Section: user.section,
    }))
  }
  eventData = Events.map(event => ({
    EventName: event.EventName,
    EventType: event.EventType,
    InviteCode: event.InviteCode,
    photo: event.photo,
    description: event.Description,
  }))
  res.send({ events: eventData ?? [], users: userData ?? [] })
  // res.send({success: true, query})
})
router.get('/nlength', async (req, res, next) => {
  if (!req.session.isAuth) {
    res.sendStatus(401)
    return
  }
  let id = req.session.userId
  let notifications = await db.GetUser(id)
  let read
  for (let i = 0; i < notifications.notifications?.length; i++) {
    if (notifications.notifications[i].read === false) {
      read = true
      break
    }
  }
  res.send({ show: read })
})
module.exports = router
