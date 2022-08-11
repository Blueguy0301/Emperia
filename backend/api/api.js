const router = require('express-promise-router')(),
  db = require('../db/db'),
  upload = require('../db/filehelper'),
  uploadToDrive = require('../routes/upload'),
  events = require('../routes/events'),
  //*checked
  profile = require('../routes/profile'),
  admin = require('../routes/admin'),
  save = require('../db/admin')
//* cors
const cors = require('cors')
router.use(
  cors({
    origin: ['https://beta.emperia.online', 'https://emperia.online', 'https://www.emperia.online'],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    header: {
      'Access-Control-Allow-Credentials': true,
    },
  })
)
//* Admin routes
router.use('/admin', admin)
//* Profile routes
router.use('/profile', profile)
//* upload routes
router.use('/upload', uploadToDrive)
//* Events routes
router.use('/events', events)
router.use('/users', require('../routes/user'))
//* get welcome request
router.get('/welcome', async (req, res, next) => {
  let id = req.session.userId
  const date = new Date()
  let hours = date.getHours()
  let status = hours < 12 ? 'morning' : hours <= 18 && hours >= 12 ? 'afternoon' : 'evening'
  let info = await db.GetUser(id)
  let name = info.DisplayName.split(' ')
  //* last name is first (0) maminta, john angelo
  let first_name = name.length >= 2 ? name[1] : name[2]
  // console.log(name.length)
  res.cookie('isFaculty', info.Level === 'Student' ? false : true, {
    domain: 'emperia.online',
    secure: true,
  })
  req.session.isAuth
    ? res.send({
        User: first_name,
        DisplayName: info.DisplayName,
        Greeting: status,
        Level: info.Level == 'Student' ? false : true,
        PrivacyPolicy: info?.PrivacyPolicy || false,
      })
    : res.send({
        User: 'Unregistered',
        Level: false,
        Greeting: status,
      })
})
//* save contact support and conerns
router.post('/contact', async (req, res, next) => {
  const { userId, isAuth } = req.session
  const { body, reportType } = req.body
  if (!isAuth) {
    res.sendStatus(401)
    return
  }
  const saved = await save.report(userId, { body, reportType })
  res.send({ saved })
})
//* Create events (for teachers and admins)
router.post('/create-events', upload.single('banners'), async (req, res, next) => {
  console.log('create events ran')
  if (!req.session.isAuth) {
    res.sendStatus(401)
    return
  }
  //check if user is faculty or admin
  const user = await db.GetUser(req.session.userId)
  console.log(user)
  if (user.Level.toLowerCase() === 'student') {
    res.status(403).send({
      Success: false,
      Reason: 'You are unauthorized to create an event.',
    })
    return
  }
  const { Name, Start, End, Desc, Invited, code, EventType, upload, visit, late, hide, view, sections, ...rest } =
    req.body
  // console.log(req.body)
  //* identity  == req.session.userId (UID)
  let temp1, send, url
  const temp2 = Object.values(JSON.parse(Invited))
  const temp3 = Object.values(JSON.parse(sections))
  url =
    req.file === undefined
      ? 'https://api.emperia.online/images/05663c0c8fdaf5ef551bca5f1c837261.png'
      : `https://api.emperia.online/images/${req.file.filename}`
  temp1 = EventType == 'false' ? 'synchronous Event' : 'Asynchronous Event'
  send = {
    Name,
    Start,
    End,
    Desc,
    temp2,
    code,
    temp1,
    temp3,
    upload,
    visit,
    late,
    hide,
    view,
    url,
    req,
  }
  const success = (await db.AddEvent(send)) ?? {
    Saved: false,
    Reason: 'Something went wrong',
  }
  if (success.Saved) {
    res.send({
      Success: true,
      Redirect:
        EventType == 'false'
          ? `/live/${code.replace(/[^a-zA-Z0-9]/g, '')}`
          : `/event/${code.replace(/[^a-zA-Z0-9]/g, '')}`,
    })
  } else {
    console.log({ Success: false, Reason: success.Reason })
    res.send({ Success: false, Reason: success.Reason })
  }
})
//* Search user by name
router.get('/search', async (req, res, next) => {
  if (!req.session.isAuth) {
    res.sendStatus(401)
    return
  }
  let { name } = req.query
  name = name?.toLowerCase()
  // console.log(name)
  if (name.length > 0) {
    let nameResults = await db.search(name)
    let sectionResults = await db.SearchSection(name)
    if ((sectionResults.found || nameResults.found) && req.session.isAuth) {
      // console.log(sectionResults.data, nameResults.data)
      res.json({ names: nameResults.data, sections: [...sectionResults.data] })
    }
  } else {
    res.json({ names: [], sections: [] })
  }
})

router.get('/home', async (req, res, next) => {
  const { isAuth } = req.session
  if (!isAuth) {
    res.send({
      success: false,
    })
    //clear cookie
    return
  }
  res.clearCookie('tempAuth', { domain: 'emperia.online', secure: true })
  res.clearCookie('identity', {
    domain: 'emperia.online',
    secure: true,
  })
  res.clearCookie('isGuest', { domain: 'emperia.online', secure: true })
  res.send({
    success: true,
  })
})
module.exports = router
