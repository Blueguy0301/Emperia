require('dotenv').config()
const db = require('mongoose')
const schema = require('./schema')
const Admin_conn = db.createConnection(process.env.db_admin, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
const moment = require('moment')
const userDB = require('./db')
const AdminModel = Admin_conn.model('admin', schema.admin)
const Sections = Admin_conn.model('sections', schema.sections)
module.exports = {
  //* Get support informations
  GetSupport: async id => {
    let isAdmin = await userDB.checkAdmin(id)
    if (!isAdmin) {
      return { Admin: false }
    }
    const data = await AdminModel.find({ ReportType: 'contact' })
    return data
  },
  //* Get Bug information
  GetBug: async id => {
    let isAdmin = await userDB.checkAdmin(id)
    if (!isAdmin) {
      return { Admin: false }
    }
    const data = await AdminModel.find({ ReportType: 'bug' })
    return data
  },
  //* Adds other people as admin
  AddAdmin: async (id, data) => {
    let isAdmin = await userDB.checkAdmin(id)
    if (!isAdmin) {
      return { Admin: false }
    }
    let User = data.map(async ({ UID, Level }) => {
      const info = await userDB.GetUser(UID)
      return { UID: info.UID, Level }
    }) //* array type
    const Data = await userDB.addAdmin(User)
    return Data
  },
  //* announces notifications
  AddNotification: async (
    id,
    { users, notif: { title, message }, ...rest }
  ) => {
    let isAdmin = await userDB.GetUser(id)
    if (isAdmin?.Level?.toLowerCase() !== 'admin') {
      return { Admin: false }
    }
    //sender,section,title,message
    const Data = await userDB.addNotification(isAdmin, users, title, message)
    return Data
  },
  report: async (userId, data) => {
    let Student = await userDB.GetUser(userId)
    Student = Student.toObject()
    const { UID, DisplayName, Mail } = Student
    const { reportType, body } = data
    const query = new AdminModel({
      ReportType: reportType,
      reporter: {
        UID: UID,
        Name: DisplayName,
        Mail: Mail,
      },
      body: body,
      TimeReported: moment().format('LLL'),
    })
    const saved = await query.save()
    if (saved) {
      return true
    } else return false
  },
  GetSection: async id => {
    let isAdmin = await userDB.checkAdmin(id)

    if (!isAdmin) {
      return { Admin: false }
    }
    const data = await Sections.find({})
    return data
  },
  SaveSection: async (id, params) => {
    let isAdmin = await userDB.checkAdmin(id)
    if (!isAdmin) {
      return { Admin: false }
    }
    const data = new Sections(params)
    await data.save()
    return data
  },
  DeleteSection: async (uid, params) => {
    let isAdmin = await userDB.checkAdmin(uid)
    if (!isAdmin.Level) {
      return { Admin: false }
    }
    const data = await Sections.findOneAndDelete(params)
    const users = await userDB.DeleteSectionFromUser({
      section: params.sectionName,
    })
    return data
  },
}
