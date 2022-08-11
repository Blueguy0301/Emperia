//import mongoose, schema, and model
require('dotenv').config()
const db = require('mongoose')
const CacheURI = process.env.db_MSALCache
const MSALConn = db.createConnection(CacheURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
const schema = new db.Schema(
  {
    Account: {},
    IdToken: {},
    AccessToken: {},
    RefreshToken: {},
    AppMetadata: {},
  },
  { strict: false }
)
const MSALCache = MSALConn.model('MSALCache', schema)
module.exports = {
  getCache: async () => {
    let cache = await MSALCache.find()
    console.log('get cache', cache)
    console.log(cache)
    return cache
  },
  save: async cache => {
    // console.log(cache)
    cache = JSON.parse(cache)
    console.log('save cache', cache)
    const newCache = new MSALCache(cache)
    await newCache.save()
    return cache
  },
  deleteCache: async () => {
    await MSALCache.deleteMany()
  },
}
