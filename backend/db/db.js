require('dotenv').config()
const db = require('mongoose')
const schema = require('./schema')
const uri = process.env.db_conn
const UserURI = process.env.db_user
const EventURI = process.env.db_event
const moment = require('moment')
const time = moment(new Date())
const graph = require('../auth/graph')
const user_conn = db.createConnection(UserURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
const Event_conn = db.createConnection(EventURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
const Chat_conn = db.createConnection(process.env.db_chat, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
schema.user.index({ DisplayName: 'text' })
const UserModel = user_conn.model('users', schema.user)
UserModel.createIndexes()
const EventModel = Event_conn.model('onGoingEvent', schema.Event)
const ChatModel = Chat_conn.model('chatLogs', schema.Chat)
const live = require('../routes/live')
module.exports = {
  //*connection: for cookies
  connect: () => {
    const cookies = db.createConnection(uri)
    return cookies
  },
  //*cookie storage:
  store: session => {
    const MongoDBSession = require('connect-mongodb-session')(session)
    const store = new MongoDBSession({
      uri: uri,
      collection: 'cookies',
    })
    return store
  },
  //*Adding user with verification using 365
  AddUser: async (UID, Name, Mail, givenName, surname, AccessToken, section) => {
    let exists = await UserModel.findOne({ UID: UID })
    if (exists) {
      console.log('User exists. updating Last Login...')
      exists.LastSeen = time.format(' MMMM Do, YYYY hh:mm a')
      exists.AccessToken = AccessToken
      await exists.save()
      return {
        Level: exists.Level,
        PrivacyPolicy: exists.PrivacyPolicy,
      }
    }
    exists = await UserModel.findOne({ Mail: Mail })
    // console.log(exists)
    if (exists && exists.UID.length === 0) {
      exists.LastSeen = time.format(' MMMM Do, YYYY hh:mm a')
      exists.AccessToken = AccessToken
      exists.UID = UID
      await exists.save()
      return {
        Level: exists.Level,
        PrivacyPolicy: exists.PrivacyPolicy,
      }
    }
    console.log('User does not exist. creating new user...')
    //*account Level
    const level = Name.includes('(Student)') ? 'Student' : 'Faculty'
    Name = Name.includes('(Student)') ? Name.replace(' (Student)', '') : Name.replace(' (Faculty)', '')
    const data = new UserModel({
      UID: UID || '',
      DisplayName: Name,
      Mail: Mail,
      Level: level,
      givenName: givenName || '',
      surname: surname || '',
      CreatedAt: time.format('MMMM Do, YYYY h:mm a'),
      LastSeen: time.format('MMMM Do, YYYY h:mm a'),
      Section: section ?? 'No Section',
      Invited_Events: [],
      AccessToken: AccessToken,
    })
    await data.save()
    return {
      Level: exists.Level,
      PrivacyPolicy: exists.PrivacyPolicy,
    }
  },
  //* force add using without signin to 365
  csvAddUser: async (datas, id) => {
    let edited = 0,
      added = 0
    let admin = await UserModel.findOne({ UID: id })
    // console.log(`admin:`, admin)
    if (!(admin.Level === 'Admin')) {
      return { edited: i, added: j }
    }
    // console.log(datas)
    const loop = await datas.map(async data => {
      let exists = await UserModel.findOne({ Mail: data.Mail })
      // console.log(data, exists)
      if (exists && exists.Mail === data.Mail) {
        exists.Level = data.Level ?? exists.Level
        exists.section = data.Section ?? exists.section
        exists.save()
        edited = edited + 1
        return { edited: edited }
      } else {
        try {
          let newUser = new UserModel({
            Mail: data.Mail,
            givenName: data.FirstName,
            surname: data.surName,
            DisplayName: `${data.surName}, ${data.FirstName}`,
            Level: data.Level ?? 'Student',
            section: data.Section ?? 'No Section',
            CreatedAt: time.format('MMMM Do, YYYY h:mm a'),
            AccessToken: '',
          })
          newUser.save()
          added = added + 1
          return { added: added + 1 }
        } catch (e) {
          console.log(e)
          return { error: e }
        }
      }
    })
    await Promise.all(loop)
    console.log(`edited: ${edited} added: ${added}`)
    return { edited: edited, added: added }
  },
  //*Adding Events
  AddEvent: async data => {
    let max = 150
    let { Name, Start, End, Desc, temp2, code, temp1, upload, visit, late, hide, view, url, temp3, req, ...rest } = data
    const exists = await EventModel.findOne({ EventName: Name })
    let Saved, Reason
    if (!exists) {
      const found = await EventModel.findOne({ InviteCode: code })
      if (found) {
        Saved = false
        Reason = 'Event code is already used'
        return { Saved, Reason }
      }
      //* returns  only a name
      const Organizer = await UIDToName(req.session.userId)
      //* returns name, uid and mail
      let admin = await GetAdmin()
      // max = max- admin.length
      admin = admin.map(e => {
        return JSON.stringify(e)
      })
      let sectionInfo = await getSectionMail(temp3, code.replace(/[^a-zA-Z0-9]/g, ''), max - admin.length)
      // console.log(`section info : ${sectionInfo.length}`)
      sectionInfo = sectionInfo.map(x => {
        return JSON.stringify({
          UID: x.UID,
          DisplayName: x.DisplayName,
          Mail: x.Mail,
        })
      })
      temp2 = [...new Set([...temp2, Organizer])]
      const folderName = `Emperia - ${Name}`
      let users = await nameToUID(temp2)

      users = users.map(x => {
        return JSON.stringify(x)
      })
      users = [...new Set([...admin, ...sectionInfo, ...users])].map(x => JSON.parse(x))
      console.log(`users: ${users.length}`)
      if (users.length > max) {
        Saved = false
        Reason = `Too many users. You can only invite ${max} on your event`
        return { Saved, Reason }
      }
      let emails = users.map(({ Mail }) => Mail)
      console.log(`email length ${emails.length}`)
      const { storageLink, readURL } = await graph.createEvent(
        req.app.locals.msalClient,
        req.session.userId,
        folderName,
        emails,
        code.replace(/[^a-zA-Z0-9]/g, '')
      )
      let isLive = !temp1.includes('Asynchronous Event')
      // console.log(isLive)
      const key = isLive ? await live.createLive(folderName) : ''
      //let ReadStorage = `/shares/u!${Buffer.from(Storage).toString('base64')}/driveItem`
      const dataSend = new EventModel({
        EventName: Name,
        Organizer: Organizer,
        StartingDate: moment(new Date(Start)).format('MM/DD/YYYY'),
        EndingDate: moment(new Date(End)).format('MM/DD/YYYY'),
        Description: Desc,
        StorageLink: storageLink,
        ViewLink: readURL,
        InviteCode: code.replace(/[^a-zA-Z0-9]/g, ''),
        EventType: temp1,
        AllowUpload: upload,
        VisitLate: visit,
        UploadLate: late,
        SubmissionView: view,
        Hide: hide,
        photo: url,
        key: isLive ? key : '',
        live: isLive,
      })
      // AddUserEvent(UID, code.replace(/[^a-zA-Z0-9]/g, ''))
      const inviteSuccess = inviteUsers(emails, dataSend.InviteCode)
      const ChatLog = new ChatModel({
        chatCode: dataSend.InviteCode,
        Chat: [],
      })
      isLive && (await ChatLog.save())
      Saved = (await dataSend.save()) && inviteSuccess ? true : false
      if (Saved) {
        const NotifSuccess = await addEventNotif(
          Organizer,
          emails,
          Name,
          dataSend.StartingDate,
          dataSend.EndingDate,
          dataSend.EventType,
          dataSend.InviteCode
        )
      }
    } else {
      Saved = false
      Reason = 'Event name already Exists'
    }
    return { Saved, Reason }
  },
  //* AddGuest to Eventsdb
  AddGuest: async (Name, school, Code) => {
    const data = await EventModel.findOne({ InviteCode: Code, Hide: false })
    if (data) {
      let connection = await EventModel.updateOne(
        { InviteCode: Code },
        {
          $addToSet: {
            Guests: { Name, school, time: time.format('MMMM Do, YYYY h:mm a') },
          },
        },
        function (err, docs) {
          console.log(err ? err : ('Updated Docs : ', docs))
          return false
        }
      )
    } else {
      console.log('error in adding geusts')
      return true
    }
  },
  //* Getting User Data
  GetUser: async id => {
    const exists = await UserModel.findOne({ UID: id })
    if (exists) return exists
    else return { DisplayName: 'error' }
  },
  //*Getting all user Data
  GetAllUsers: async (UID, curBatchNum, perRequest) => {
    const result = await UserModel.findOne({ UID })
    //* result  : result OBJECT
    if (result?.Level == 'Admin') {
      // 100*2-100=1
      const Users = await UserModel.find()
        .skip(perRequest * curBatchNum - perRequest)
        .limit(perRequest)
      const total = await UserModel.countDocuments()
      return { Admin: true, Users, totalPages: total / 50 }
    } else {
      return { Admin: false }
    }
  },
  //* update notifcation read as true
  updateNotif: async (id, data) => {
    const exists = await UserModel.findOneAndUpdate(
      { UID: id, notifications: { $elemMatch: { _id: data } } },
      {
        $set: {
          'notifications.$.read': true,
        },
      }, // list fields you like to change
      { new: true, safe: true, upsert: true }
    )
    if (exists) return true
    else return false
  },
  //* update user
  UpdateUser: async (id, params) => {
    const data = await UserModel.findOneAndUpdate({ UID: id }, params)
    console.log(data)
    if (data) {
      return data
    } else {
      return { DisplayName: 'error' }
    }
  },
  //* Getting UserProfile
  GetProfile: async (UID, Mail) => {
    const auth = await UserModel.findOne({ UID })
    let profile
    if (auth) {
      profile = await UserModel.findOne({ Mail })
      return profile ? { ...profile?.toObject(), Success: true } : { Success: false }
    }
  },
  //*Getting Ongoing Events
  GetEvents: async UID => {
    const result = await UserModel.findOne({ UID })
    //* result  : result OBJECT
    const Events = await EventModel.find({
      InviteCode: { $in: result.Invited_Events },
    })
    return Events
  },
  GetAllEvents: async UID => {
    const result = await UserModel.findOne({ UID })
    //* result  : result OBJECT
    if (result?.Level == 'Admin') {
      const Events = await EventModel.find()
      return { Admin: true, Events }
    } else {
      return { Admin: false }
    }
  },
  //*Getting Random Events
  GetRandomEvents: async () => {
    var random = Math.floor(Math.random() * 4)
    const data = await EventModel.find().skip(random).limit(5)
    return data
  },
  //*Getting Events by code (Public)
  GetEventByCode: async code => {
    //*^[aA-zZ\d]+$
    const data = await EventModel.findOne({ InviteCode: code, Hide: false })
    // console.log(data)
    return !data ? { Exists: false } : { data, Exists: true }
  },
  GetLogs: async (code, uid) => {
    //check if user is part of the event
    const user = await UserModel.findOne({ UID: uid })
    console.log(user)
    const event = await EventModel.findOne({ InviteCode: code })
    //check if user is organizer
    if (event.Organizer === user.DisplayName || user.Level === 'Admin') {
      const data = await ChatModel.findOne({ chatCode: code })
      return data
    }
    return false
  },
  // * Get Event (private)
  GetEventInformation: async (code, id) => {
    // console.log(code)
    const data = await EventModel.findOne({ InviteCode: code })
    const Organizer = await UIDToName(id)
    if (data) {
      // console.log(`Organizer : ${Organizer}`)
      let isOrganizer = Organizer === data.Organizer || false
      return {
        data,
        Exists: true,
        isOrganizer,
      }
    } else {
      return { Exists: false }
    }
  },
  //* Get Event List of current user(private)
  GetEventByInvitation: async uid => {
    let results
    const userData = await UserModel.findOne({ UID: uid })
    if (userData) {
      const Invitations = userData.Invited_Events
      const Events = EventModel.find({ InviteCode: { $in: Invitations } })
      results = Events
    } else results = { found: false }
    return results
  },
  //* Get Event of other users
  GetUserEvents: async (uid, events) => {
    let results
    const userData = await UserModel.findOne({ UID: uid })
    if (userData) {
      const Events = EventModel.find({ InviteCode: { $in: events } })
      results = Events
    } else results = { found: false }
    return results
  },
  //* Get View and upload Link of event
  GetLink: async code => {
    // console.log(code)
    const data = await EventModel.findOne({ InviteCode: code })
    const { ViewLink, StorageLink } = data
    return { ViewLink, StorageLink }
  },
  //* Get Chat message of event
  GetChatMessage: async event => {
    //* get chat message and limit it to the last 50 sent
    const data = await ChatModel.findOne({ chatCode: event }).select({
      Chat: { $slice: -50 },
    })
    return data
  },
  //*Seaarch Function for front end
  search: async name => {
    const temp = name.split(' ')
    let realName = ''
    let send = []
    for (n in temp) {
      realName += `${temp[n].charAt(0).toUpperCase() + temp[n].slice(1)} `
    }
    //limit to 10 results
    const Result = await UserModel.find({
      $text: {
        $search: realName,
        $caseSensitive: false,
      },
    })
    for (let i = 0; i < Result.length; i++) {
      send[i] = {
        UID: Result[i].UID,
        DisplayName: Result[i].DisplayName,
        Mail: Result[i].Mail,
        Level: Result[i].Level,
        section: Result[i].section,
      }
    }
    return { data: send, found: Result.length > 0 }
    //create a regex that matches a word
  },
  //* Search sections
  SearchSection: async name => {
    let Result = await UserModel.find({
      section: { $regex: '^' + name, $options: 'i' },
    })
    // console.log(Result)
    Result = [...new Set(Result.map(({ section }) => section))]
    return { data: Result, found: Result.length > 0 ? true : false }
  },
  //* search events via EventName in EventModel
  searchEvent: async name => {
    const Result = await EventModel.find({
      EventName: { $regex: '^' + name, $options: 'i' },
    })
    return Result
  },
  //* update section (individual)
  UpdateSection: async (uid, id, params) => {
    const isAdmin = await UserModel.findOne({ UID: uid })
    // console.log(isAdmin.Level)
    if (isAdmin?.Level == 'Admin') {
      const data = await UserModel.findOneAndUpdate({ _id: id }, params)
      // console.log(data)
      return data ? true : false
    }
    return false
  },
  //* update Events
  UpdateEvent: async (code, data) => {
    let success
    const result = await EventModel.findOneAndUpdate({ InviteCode: code }, data, err => {
      success = err ? err : true
    })
    // console.log(code, data)
    return success
  },
  addNotification: async (sender, section, title, message) => {
    let usersSection = await UserModel.find({ section: { $in: section } })
    let users = await UserModel.find({ DisplayName: { $in: section } })
    usersSection = usersSection.map(({ Mail }) => Mail)
    console.log(`user length is ${users.length}`)
    console.log(`userSection length is ${usersSection.length}`)
    //combine both arrays
    users = users.map(({ Mail }) => Mail)
    let AllUsers = [...users, ...usersSection]
    AllUsers = [...new Set(AllUsers)]
    console.log(`AllUsers length is ${AllUsers.length}`)
    // console.log(AllUsers)
    const data = await addNotif(sender, { title, message }, AllUsers)
    console.log(data)
    return data
  },
  ChatMessage: async (event, chat) => {
    const data = await ChatModel.findOneAndUpdate(
      { chatCode: event },
      {
        $push: {
          Chat: {
            ...chat,
          },
        },
      }
    )
    // console.log(data)
    return data ? true : false
  },
  JoinEvent: async (code, uid, isGuest) => {
    const Event = await EventModel.findOne({ InviteCode: code, Hide: false })
    // console.log(isGuest)
    if (Event && !isGuest) {
      const data = await UserModel.findOneAndUpdate({ UID: uid }, { $push: { Invited_Events: code } })
      const organizer = await UserModel.findOne({
        DisplayName: Event.Organizer,
      })
      if (Object.keys(data).length === 0) return { success: false }
      return {
        mail: data.Mail,
        token: organizer.AccessToken,
        link: Event.ViewLink,
      }
    }
    return Event ? { success: true } : { success: false }
  },
  DeleteEvent: async (code, organizer) => {
    let data = await EventModel.findOne({ InviteCode: code }),
      users
    console.log(data.toObject())
    if (!data) {
      return false
    }
    let user = await UserModel.findOne({ UID: organizer })
    const isOrganizer = data.Organizer === user.DisplayName
    if (user.Level !== 'Admin') {
      //* "Faculty" !== "Admin"  (true)
      if (!isOrganizer) return false
    }
    // check if there is an event inside data
    if (data.live) {
      live.deleteLive(data.key)
      const chat = await ChatModel.findOneAndDelete({ chatCode: code })
    }
    const result = await EventModel.findOneAndDelete({ InviteCode: code })
    users = await UserModel.updateMany({ Invited_Events: code }, { $pull: { Invited_Events: code } })
    return users ? true : false
  },
  //* updates all users section when deleted
  DeleteSectionFromUser: async section => {
    //update all the users that has the section to no section
    const data = await UserModel.updateMany(section, {
      $set: { section: 'No Section' },
    })
    console.log(data)
    return data ? true : false
  },
  DeleteNotif: async (uid, id) => {
    //get user from uid
    const user = await UserModel.findOne({ UID: uid })
    //delete the notif inside user with an id of id
    const data = await UserModel.findOneAndUpdate({ UID: uid }, { $pull: { Notifications: { _id: id } } })
    return data ? true : false
  },
  csvRemoveUsers: async (data, uid) => {
    //check if uid is admin
    const isAdmin = await UserModel.findOne({ UID: uid })
    if (isAdmin?.Level !== 'Admin') return false
    if (!Array.isArray(data)) return false
    if (data.length === 0) return false
    data = data.map(user => user.Mail ?? user)
    // console.log(data)
    const result = await UserModel.deleteMany({ Mail: { $in: data } })
    console.log(result)
    return { removed: result.deletedCount }
  },
  checkAdmin: async uid => {
    const data = await UserModel.findOne({ UID: uid })
    return data.Level.toLowerCase() === 'admin'
  },
  GetInvited: async code => {
    const invitedUsers = await UserModel.find({ Invited_Events: code })
    // console.log(invitedUsers)
    let filtered = invitedUsers.map(({ DisplayName, Mail, section }) => {
      return {
        DisplayName,
        section,
      }
    })
    // console.log(filtered)
    return filtered
  },
  GetGuests: async code => {
    let guests = await EventModel.findOne({ InviteCode: code })
    guests = guests.toObject()
    guests = await guests.Guests.map(guest => {
      return {
        type: 'Guest',
        Name: guest.Name,
        school: guest.school,
        time: guest.time,
      }
    })
    //parse a json array of guests
    return guests
  },
}
//*add events to userModel via UID
const AddUserEvent = async (ID, eventCode) => {
  let connection
  try {
    connection = await UserModel.updateMany(
      { UID: { $in: ID } },
      { $addToSet: { Invited_Events: eventCode } },
      function (err, docs) {
        if (err) {
          console.log(err)
        } else {
          console.log('Updated Docs : ', docs)
        }
      }
    )
  } catch (e) {
    console.log('error adding user event to user')
    console.log(e)
    return false
  }
}
//*NameToUID and Email
const nameToUID = async Name => {
  let connection
  let data = []
  try {
    connection = await UserModel.find({ DisplayName: { $in: Name } })
    console.log('data found, converting name to uid and mail:')
    // console.log(connection)
    for (let i = 0; i < Name.length; i++) {
      if (connection) {
        data[i] = {
          UID: connection[i].UID,
          DisplayName: connection[i].DisplayName,
          Mail: connection[i].Mail,
        }
      }
    }
    // console.log(connection)
    return data
  } catch (e) {
    console.log('error in converting Name To UID')
    console.log(e)
    return []
  }
}
//* UIDToName (single)
const UIDToName = async UID => {
  try {
    let connection = await UserModel.findOne({ UID })
    console.log('Name to UID found, converting to name')
    return connection?.toObject().DisplayName
  } catch (e) {
    console.log('error in converting UID To Name ')
    console.log(e)
    return []
  }
}
const GetAdmin = async () => {
  let connection
  let data = []
  try {
    connection = await UserModel.find({ Level: 'Admin' })
    console.log('Admin found, converting name to uid and mail:')
    console.log(connection.length)
    data = connection.map((admin, i) => {
      return {
        UID: admin.UID,
        DisplayName: admin.DisplayName,
        Mail: admin.Mail,
      }
    })
    // console.log('admin :')
    // console.log(data)
    return data
  } catch (e) {
    console.log('error in Getting Admin')
    console.log(e)
    return []
  }
}
const addEventNotif = async (organizer, users, EventName, StartingDate, EndingDate, EventType, code) => {
  try {
    let notifications = {
      sender: organizer,
      body: {
        title: `${organizer} invited you to ${EventName}`,
        message: `You're invited ! ${EventName} is starting on ${StartingDate} and ending on ${EndingDate}. it is a/an ${EventType} event. See you there!`,
      },
      created_at: moment().format('L'),
      read: false,
      code,
    }
    connection = await UserModel.updateMany(
      { Mail: { $in: users } },
      { $addToSet: { notifications } },
      function (err, docs) {
        if (err) {
          console.log(err)
        } else {
          console.log('Updated Docs : ', docs)
        }
      }
    )
    return true
  } catch (e) {
    console.log('error adding user event to user')
    console.log(e)
    return false
  }
}
const addNotif = async (sender, body, users) => {
  // console.log(`total users in addNotif`, users.length)
  try {
    let notifications = {
      sender: sender.DisplayName,
      body: {
        title: body.title,
        message: body.message,
      },
      created_at: moment().format('L'),
      read: false,
      code: 'ADMIN ANNOUNCEMENT',
    }
    connection = await UserModel.updateMany(
      { Mail: { $in: users } },
      { $addToSet: { notifications } },
      function (err, docs) {
        if (err) {
          console.log(err)
        } else {
          console.log('Updated Docs : ', docs)
        }
      }
    )
    return true
  } catch (e) {
    console.log('error adding user event to user')
    console.log(e)
    return false
  }
}
const getSectionMail = async (section, eventCode, max) => {
  let connection
  try {
    connection = await UserModel.find({ section: { $in: section } }).limit(max)
    //* return all users in section
    return connection
  } catch (e) {
    console.log('error adding user event to user (section)')
    console.log(e)
    return false
  }
}
const inviteUsers = async (mail, eventCode) => {
  let connection
  try {
    connection = await UserModel.updateMany(
      { Mail: { $in: mail } },
      { $addToSet: { Invited_Events: eventCode } },
      function (err, docs) {
        if (err) {
          console.log(err)
        } else {
          console.log('Updated Docs : ', docs)
        }
      }
    )
    return true
  } catch (e) {
    console.log('error adding user event to user')
    console.log(e)
    return false
  }
}
