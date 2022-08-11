const router = require('express-promise-router')()
const graph = require('./graph') // ?
const db = require('../db/db') //?
const cors = require('cors')
router.use(
  cors({
    origin: ['https://emperia.online', 'https://beta.emperia.online', 'https://www.emperia.online'],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    header: {
      'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': true,
    },
  })
)
//log router

router.post('/signin', async function (req, res) {
  const urlParameters = {
    scopes: process.env.permissions.split(','),
    redirectUri: process.env.OAUTH_REDIRECT_URI,
  }
  try {
    const authUrl = await req.app.locals.msalClient.getAuthCodeUrl(urlParameters)
    // console.log(req.app.locals.msalClient)
    res.send(authUrl)
  } catch (error) {
    console.log(`Error: ${error}`)
    res.redirect('/')
  }
})
//redirect route
router.get('/callback', async function (req, res) {
  console.log('callback called in front end')
  const tokenRequest = {
    code: req.query.code,
    scopes: process.env.permissions.split(','),
    redirectUri: process.env.OAUTH_REDIRECT_URI,
  }
  try {
    const response = await req.app.locals.msalClient.acquireTokenByCode(tokenRequest)
    // Save the user's homeAccountId in their session
    req.session.userToken = response.accessToken
    const user = await graph.getUserDetails(req.app.locals.msalClient, response.account.homeAccountId)
    req.session.userId = response.account.homeAccountId
    const { Level, PrivacyPolicy } = await db.AddUser(
      response.account.homeAccountId,
      user.displayName,
      user.mail,
      user.givenName,
      user.surname,
      response.accessToken
    )
    req.session.isAuth = true
    req.session.DN = user.displayName?.replace(/\([^)]*\)/, '')
    req.session.Level = Level
    req.session.isFaculty = Level.toLowerCase() === 'faculty' || Level.toLowerCase() === 'admin'
    res.cookie('first', PrivacyPolicy, {
      domain: 'emperia.online',
      secure: true,
    })
  } catch (error) {
    console.log('error in callback: ' + error)
  }

  res.cookie(
    'ud',
    JSON.stringify({
      userName: req.session.DN,
      Level: req.session.Level,
      isFaculty: req.session.isFaculty,
      isAuth: req.session.isAuth,
    }),
    {
      domain: 'emperia.online',
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    }
  )
  //wait for a bit to redirect
  setTimeout(() => {
    res.redirect('https://emperia.online/')
  }, 1000)
})
router.post('/signout', async function (req, res) {
  console.log('signout called in front end')
  // Sign out
  if (req.session.userId) {
    // Look up the user's account in the cache
    console.log('deleting cache')
    const accounts = await req.app.locals.msalClient.getTokenCache().getAllAccounts()
    const userAccount = accounts.find(a => a.homeAccountId === req.session.userId)
    // Remove the account
    if (userAccount) {
      console.log('deleting user account')
      req.app.locals.msalClient.getTokenCache().removeAccount(userAccount)
    }
    res.clearCookie('ud', { domain: 'emperia.online' })
    // Destroy the user's session
    req.session.destroy(function (err) {
      console.log(err || 'destroying cookies')
    })
    res.send({
      successful: true,
      redirect: 'https://emperia.online/',
    })
  } else {
    res.clearCookie('ud', { domain: 'emperia.online' })

    res.send({
      successful: false,
      redirect: 'https://emperia.online/',
    })
  }
})
module.exports = router
