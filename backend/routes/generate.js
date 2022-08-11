const router = require("express-promise-router")()
const db = require("../db/db")
const cors = require("cors")
const live = require("./live")
router.use(
  cors({
    origin: [
      "https://emperia.online",
      "https://beta.emperia.online",
      "https://www.emperia.online",
    ],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    header: {
      "Access-Control-Allow-Credentials": true,
    },
  })
)
//! /api/events/generate
//* get stream key
router.get("/streamkey", async (req, res) => {
  console.log("get Streamkey  called")
  // console.log("query", req.body.query)
  let code = req.query["code"]
  let tempAuth = req.query["tempAuth"] ?? "false"

  let id = req.session.userId,
    isAuth = req.session.isAuth
  let {data, isOrganizer} = await db.GetEventInformation(code, id)
  // console.log(data)
  // EventName, Description
  if (isAuth || tempAuth === "true") {
    res.send({
      key: data?.toObject().key ? data.toObject().key : "no streamkey",
      EventName: data?.toObject().EventName,
      Description: data?.toObject().Description,
      Organizer: data?.toObject().Organizer,
      isOrganizer,
      live: data?.toObject().live,
    })
  } else {
    res.send({key: null})
  }
})
router.post("/add-rtmp", async (req, res) => {
  console.log("add rtmp called")
  let id = req.body.id ?? req.query["id"]
  let link = req.body.link ?? req.query["link"]
  let key = req.body.key ?? req.query["key"]
  // console.log(id, key, link)
  const result = await live.addRTMP(link, key, id)
  // * result.dataId is used to remove the rtmp link. send this to frontend
  res.send(result)
})
router.delete("/remove-rtmp", async (req, res, next) => {
  console.log("remove rtmp called")
  let key = req.query.key
  let dataId = req.query.dataId
  const result = await live.removeRTMP(key, dataId)
  // console.log(result)
  res.send(result)
})
module.exports = router
