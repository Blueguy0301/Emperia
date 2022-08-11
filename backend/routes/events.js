const router = require('express-promise-router')()
const db = require('../db/db')
const graph = require('../auth/graph'),
  generate = require('./generate'),
  live = require('./live'),
  fs = require('fs'),
  { format } = require('@fast-csv/format')
const moment = require('moment')
const current = moment()
//* cors
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
//! /api/events/
//* generates stream key
router.use('/generate', generate)
//*get rtmp information
router.get('/rtmp/:id', async (req, res, next) => {
  console.log('get rtmp called')
  const { id } = req.params
  const data = (await live.getRTMP(id)) ?? []
  res.send({
    length: data.length,
    endpoints: data ?? [],
  })
})
//*get events of a user using invite code
router.get('/invited', async (req, res, next) => {
  console.log('invited  called')
  // ! UID is in cookies, remember to change this.
  let id = req.session.userId
  let event = []
  const data = await db.GetEventByInvitation(id)
  if (data.length > 0) {
    for (let i in data) {
      event[i] = {
        EventName: data[i].EventName,
        StartingDate: data[i].StartingDate,
        EndingDate: data[i].EndingDate,
        Description: data[i].Description,
        EventType: data[i].EventType,
        photo: data[i].toObject().photo,
        code: data[i].InviteCode,
      }
    }
    res.send({ event, empty: false })
  } else {
    res.send({ event, empty: true })
  }
})
//* Check if a user is invited to an event
router.get('/isinvited/:code', async (req, res, next) => {
  console.log('isInvited  called')
  // console.log('run isInvited')
  let id = req.session.userId || 'none',
    { code } = req.params,
    found = false
  const events = await db.GetEventByInvitation(id)
  // console.log(events)
  //todo : make this a search algo
  if (events.length > 0) {
    for (let i in events) {
      if (events[i].toObject().InviteCode.toLowerCase() === code.toLowerCase()) {
        found = true
        break
      }
      found = false
    }
  }
  //   console.log(found)
  res.send({ found })
})
//* get random events that's happening
router.get('/upcoming', async (req, res, next) => {
  console.log('upcoming  called')
  //*get events using invite code that is already in the db.events
  // ! UID is in cookies, remember to change this.
  let id = req.session.userId
  let event = []
  const data = await db.GetRandomEvents() //* retruns an aray
  for (let i in data) {
    // console.log(data[i].toObject().photo)
    event[i] = {
      EventName: data[i].EventName,
      StartingDate: data[i].StartingDate,
      EndingDate: data[i].EndingDate,
      Description: data[i].Description,
      EventType: data[i].EventType,
      photo: data[i].toObject().photo,
    }
  }
  //   console.log(event)
  res.send({ event, empty: data.length === 0 })
})
//* get all current events in user
router.get('/current', async (req, res, next) => {
  //get events of user
  const events = await db.GetEventByInvitation(req.session.userId)
  //check events date if it's in the past
  let currentEvents = []
  // console.log(events)
  if (events.length > 0) {
    for (let i in events) {
      if (current.isSameOrBefore(moment(events[i].EndingDate, 'MM/DD/YYYY'))) {
        currentEvents.push({
          EventName: events[i].EventName,
          StartingDate: events[i].StartingDate,
          EndingDate: events[i].EndingDate,
          Description: events[i].Description,
          EventType: events[i].EventType,
          photo: events[i].toObject().photo,
          code: events[i].InviteCode,
        })
      }
    }
    res.send({ event: currentEvents, empty: currentEvents.length === 0 })
  } else {
    res.send({ event: [], empty: true })
  }
})
router.get('/ended', async (req, res, next) => {
  const events = await db.GetEventByInvitation(req.session.userId)
  let endedEvents = []
  if (events.length > 0) {
    for (let i in events) {
      //compare events.endingDate if it's before current date
      if (moment(events[i].EndingDate, 'MM/DD/YYYY').isBefore(current)) {
        endedEvents.push({
          EventName: events[i].EventName,
          StartingDate: events[i].StartingDate,
          EndingDate: events[i].EndingDate,
          Description: events[i].Description,
          EventType: events[i].EventType,
          photo: events[i].toObject().photo,
          code: events[i].InviteCode,
        })
      }
    }
    res.send({ event: endedEvents, empty: endedEvents.length === 0 })
    return
  }
  res.send({ event: [], empty: true })
})
//* gets view link to all submissions
router.post('/link', async (req, res, next) => {
  console.log('link  called')
  const { Code } = req.body
  console.log('Code sa link', Code)
  //   console.log(Code)
  const { isAuth, userId } = req.session
  if (isAuth) {
    const { ViewLink } = await db.GetLink(Code)
    // console.log(ViewLink)
    const information = await graph.GetEvent(ViewLink, Code, req.session.userToken)
    res.send(information)
  }
})
//* Get Event by code (Private)
router.post('/code/:code', async (req, res, next) => {
  console.log(' post /code/:code ran')
  let { code } = req.params
  let { Exists, data, isOrganizer, invitedUsers } = await db.GetEventInformation(code, req.session.userId)
  if (req.session.isAuth && Exists) {
    const send = data && {
      EventName: data.EventName,
      isOrganizer,
      StartingDate: data.StartingDate,
      EndingDate: data.EndingDate,
      Description: data.Description,
      InviteCode: data.InviteCode,
      EventType: data.EventType,
      AllowUpload: data.AllowUpload,
      VisitLate: data.VisitLate,
      UploadLate: data.UploadLate,
      SubmissionView: data.SubmissionView,
      photo: data.toObject().photo,
      Live: data.EventType === 'Syncronous Event' ? data.live : false,
      Hide: data.Hide,
      Invited: invitedUsers,
    }
    res.send({ redirect: true, ...send })
  } else {
    res.send({ redirect: false, authenticated: false })
  }
})
//* Get Event by code (public)
router.get('/code/:code', async (req, res, next) => {
  console.log('get /code/:code ran')
  let { code } = req.params
  console.log(code)
  let { Exists, data } = await db.GetEventByCode(code)
  console.log(Exists)
  if (Exists) {
    // console.log(data)
    res.cookie('tempAuth', true, { domain: 'emperia.online', secure: true })
    res.send({ redirect: true })
  } else {
    res.send({ redirect: false })
  }
})
//* updates event settings
router.post('/update', async (req, res, next) => {
  console.log('update  called')
  const { InviteCode, ...params } = req.body
  console.log(req.body)
  const result = await db.UpdateEvent(InviteCode, params)
  res.send(result)
})
//* Add guest user
router.post('/guest', async (req, res, next) => {
  console.log('guest post  called')
  const { Name, School, Code } = req.body
  const error = await db.AddGuest(Name, School, Code)
  if (!error) {
    req.session.isAuth = true
    req.session.DN = Name
    req.session.Level = 'Guest'
    const cookieInfo = {
      userName: req.session.DN,
      Level: req.session.Level,
      isFaculty: req.session.isFaculty ?? false,
      isAuth: req.session.isAuth,
    }
    res.cookie('isGuest', true, { domain: 'emperia.online', secure: true })
    res.cookie('code', Code, { domain: 'emperia.online', secure: true })
    res.cookie('ud', JSON.stringify(cookieInfo), {
      domain: 'emperia.online',
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    })
    res.send({ redirect: true })
  } else {
    res.send({ error: true })
  }
})
//* sends an update every x seconds
router.get('/hidden/:code', async (req, res, next) => {
  console.log('hidden  called')
  let { code } = req.params
  console.log(`code : ${code}`)
  let { Exists, data } = await db.GetEventInformation(code, req.session.userId)
  if (Exists) {
    const send = {
      AllowUpload: data.AllowUpload,
      VisitLate: data.VisitLate,
      UploadLate: data.UploadLate,
      SubmissionView: data.SubmissionView,
    }
    res.send({ ...send })
  } else {
    res.send({ redirect: false })
  }
})
//* gets invited events of a user
router.get('/:id', async (req, res, next) => {
  console.log('id has been called called')
  let { id } = req.params,
    event = []
  let eMail = `${id}@alabang.sti.edu.ph`
  console.log(`uid : ${req.session.userId}`)
  let profile = await db.GetProfile(req.session.userId, eMail)
  const data = await db.GetUserEvents(req.session.userId, profile.Invited_Events)
  if (data.length > 0) {
    for (let i in data) {
      event[i] = {
        EventName: data[i].EventName,
        StartingDate: data[i].StartingDate,
        EndingDate: data[i].EndingDate,
        Description: data[i].Description,
        EventType: data[i].EventType,
        photo: data[i].toObject().photo,
        code: 'disabled',
      }
    }
    res.send({ event, empty: false })
  } else {
    res.send({ event, empty: true })
  }
})
router.get('/:code/messages', async (req, res, next) => {
  const { code } = req.params
  const lastChat = await db.GetChatMessage(code)
  res.send(lastChat?.Chat ?? [{}])
})
router.delete('/delete/:code', async (req, res, next) => {
  if (!req.session.isAuth) {
    res.sendStatus(401)
    return
  }
  let { code } = req.params
  const result = await db.DeleteEvent(code, req.session.userId)
  if (!result) {
    res.sendStatus(401)
    return
  }
  code = code.toLowerCase()
  const videoPath = `/mnt/emperia-storage/video/${code}/`
  let success = fs.rmSync(videoPath, { recursive: true })
  res.send({ success: result && success ? true : false })
})
//* join using invite code for not guest
router.post('/join', async (req, res, next) => {
  const { code, guest } = req.body
  const result = await db.JoinEvent(code, req.session.userId, guest)
  const success = graph.inviteUser(result)

  res.send({ success: success })
})
router.get('/:code/logs', async (req, res, next) => {
  const csvFile = fs.createWriteStream(`fileName.csv`)
  const stream = format({ headers: true })
  const { code } = req.params
  const logs = await db.GetLogs(code, req.session.userId)
  //check if user is authenticated
  if (!req.session.isAuth) {
    res.sendStatus(401)
    return
  }
  if (!logs) {
    res.sendStatus(401)
    return
  }
  logs.Chat.map(log => {
    stream.write({
      Name: log.Name,
      Message: log.Message,
      Time: log.time,
    })
  })
  //create csv file
  stream.pipe(csvFile)
  //save csv file
  csvFile.on('finish', () => {
    csvFile.close()
    res.download(`fileName.csv`)
  })
  stream.end()
})
router.get('/:code/invitedUsers', async (req, res, next) => {
  if (!req.session.isAuth) {
    res.sendStatus(401)
    return
  }
  const { code } = req.params
  const { Live } = req.query ?? false
  let guest
  if (Live) {
    guest = await db.GetGuests(code)
  }
  const invited = await db.GetInvited(code)
  res.send([...invited, ...(Live ? guest : [])])
})
module.exports = router
