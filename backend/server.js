require('dotenv').config()
//* express and servers, database, fs
const port = process.env.port,
  express = require('express'),
  app = express(),
  https = require('http'),
  server = https.createServer(app),
  io = require('socket.io')(server, {
    cors: {
      origin: ['https://beta.emperia.online', 'https://emperia.online', 'https://www.emperia.online'],
    },
  }),
  db = require('./db/db')
//* auth sessions, cookies, and routers
const msal = require('@azure/msal-node'),
  session = require('express-session'),
  maxAge = 1000 * 60 * 60 * 24
//* routes and file systems
const upload = require('./routes/upload'),
  authRouter = require('./auth/authHelper'),
  api = require('./api/api'),
  images = require('./routes/images'),
  chat = require('./routes/chat'),
  media = require('./routes/video'),
  graph = require('./auth/graph'),
  cachePath = '/home/emperia/cache.json',
  fs = require('fs')
//* auth config and cors`
const cors = require('cors')
app.use(
  cors({
    origin: ['https://emperia.online', 'https://beta.emperia.online', 'https://www.emperia.online'],
    credentials: true,
    header: {
      'Access-Control-Allow-Credentials': true,
    },
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  })
)
// Call back APIs which automatically write and read into a .json file - example implementation
const beforeCacheAccess = async cacheContext => {
  console.log('beforeCacheAccess')
  await cacheContext.tokenCache.deserialize(await fs.readFile(cachePath, 'utf-8', e => console.log(e)))
}

const afterCacheAccess = async cacheContext => {
  console.log('afterCacheAccess')
  if (cacheContext.cacheHasChanged) {
    await fs.writeFile(cachePath, cacheContext.tokenCache.serialize(), e => console.log(e))
  }
}
const cachePlugin = {
  beforeCacheAccess,
  afterCacheAccess,
}
//* Cookies and client for auth
const msalConfig = {
  auth: {
    clientId: process.env.clientId,
    authority: process.env.OAUTH_AUTHORITY,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
  },
  cache: {
    cachePlugin,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message)
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
}
app.locals.msalClient = new msal.ConfidentialClientApplication(msalConfig)
const conn = db.connect()
app.use(
  session({
    secret: process.env.session_secret,
    // domain:
    // req.get('origin').slice(0, 17) === 'http://localhost:' ? 'localhost' : 'emperia.online',
    resave: true,
    saveUninitialized: false,
    unset: 'destroy',
    maxAge: maxAge,
    store: db.store(session),
    cookie: {
      domain: 'emperia.online',
      maxAge: maxAge,
    },
    secure: true,
    //renew cookies when users requests
  })
)
app.use('*', async (req, res, next) => {
  if (req.session.isAuth) {
    const cookieInfo = {
      userName: req.session.DN ?? ``,
      Level: req.session.Level ?? 'Guest',
      isFaculty: req.session.isFaculty ?? false,
      isAuth: req.session.isAuth ?? false,
    }
    res.cookie('ud', JSON.stringify(cookieInfo), {
      domain: 'emperia.online',
      maxAge: maxAge,
      secure: true,
    })
  } else {
    res.clearCookie('ud', {
      domain: 'emperia.online',
      maxAge: maxAge,
      secure: true,
    })
    console.log('cleared cookie')
  }
  next()
})
app.set('trust proxy', 1)
//* api, routings and back end server-rendering
app.use('/auth', authRouter)
app.use(express.json())
app.use('/api', api) //* auth check done
app.use('/images', images)
app.use('/upload', upload) //* auth check done
app.use('/media', media)
//* socket io for chat implementation and status checking
const botName = 'Emperia'
io.on('connection', socket => {
  //when ceonnect
  socket.on('Join', ({ data, code }) => {
    // console.log(socket.id)
    console.log('join called')
    const user = chat.userJoin(socket.id, data.Name, code)
    const totalViewers = chat.getRoomUsers(code)
    // console.log(user)
    socket.join(user.room)
    // Welcome current user (basic emit)
    const message = chat.formatMessage(botName, `${user.username} has joined the event`)
    socket.emit('message', { ...message })
    socket.to(user.room).emit('getViewers', totalViewers.length)
    // Broadcast to room
    socket.broadcast.to(user.room).emit('message', { ...message })
    db.ChatMessage(user.room, {
      Name: message.username,
      Message: message.text,
      time: message.time,
    })
  })
  // Listen for chat
  socket.on('chatMessage', msg => {
    const user = chat.getCurrentUser(socket.id)
    const message = chat.formatMessage(user.username, msg)
    io.to(user.room).emit('message', { ...message })
    db.ChatMessage(user.room, {
      Name: message.username,
      Message: message.text,
      time: message.time,
    })
  })
  socket.on('getViewers', ({ code }) => {
    console.log(`code : `, code)
    const viewers = chat.getRoomUsers(code)
    console.log(`viewers : `, viewers)
    socket.emit('getViewers', viewers.length)
  })
  //when leaving the evnet
  socket.on('Leave', () => {
    console.log('leave called')
    const user = chat.getCurrentUser(socket.id)
    const totalViewers = chat.getRoomUsers(user?.room)
    console.log('user', totalViewers.length - 1 <= 0 ? 0 : totalViewers.length - 1)
    if (user) {
      socket.to(user.room).emit('getViewers', totalViewers.length - 1 <= 0 ? 0 : totalViewers.length - 1)
      const message = chat.formatMessage(botName, `${user.username} has left the event`)
      io.to(user.room).emit('message', { ...message })
      db.ChatMessage(user.room, {
        Name: message.username,
        Message: message.text,
        time: message.time,
      })
    }
    const removeUser = chat.userLeave(socket.id)
    console.log(removeUser)
  })
  //get total viewers of the event

  //when disconnect
  socket.on('disconnect', () => {
    const user = chat.getCurrentUser(socket.id)
    // console.log("user disconnected", user)
    const message = chat.formatMessage(botName, `${user?.username ?? 'someone'} left the event`)
    socket.broadcast.to(user?.room).emit('message', { ...message })
    db.ChatMessage(user?.room || 'no room', {
      Name: message.username,
      Message: message.text,
      time: message.time,
    })
    chat.userLeave(socket.id)
    io.emit('getUsers', chat.users)
  })
  //todo : check if user left the room
})
//Backend start
server.listen(port, err => {
  err ? console.log('error happened', err) : console.log('server is at port ' + port)
})
