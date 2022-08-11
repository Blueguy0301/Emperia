const mongoose = require("mongoose")
const {Schema} = mongoose
module.exports = {
  user: new Schema({
    UID: {
      type: String,
      default: "",
    },
    DisplayName: {
      type: String,
      required: true,
    },
    givenName: {
      type: String,
      required: true,
      default: "",
    },
    surname: {
      type: String,
      required: true,
      default: "",
    },
    Mail: {
      type: String,
      required: true,
    },
    Level: {
      type: String,
      required: true,
    },
    CreatedAt: {
      type: String,
      required: true,
      immutable: true,
    },
    LastSeen: {
      type: String,
      required: true,
      default: "Not yet logged in",
    },
    Invited_Events: {
      type: Array,
    },
    notifications: [
      {
        sender: String,
        body: {title: String, message: String},
        created_at: String,
        read: Boolean,
        code: String,
        required: false,
      },
    ],
    PrivacyPolicy: {
      type: Boolean,
      default: false,
    },
    section: {
      type: String,
      required: true,
      default: "No Section",
    },
    AccessToken: {
      type: String,
      default: "",
    },
  }),
  Event: new Schema(
    {
      EventName: {
        type: String,
        required: true,
      },
      Organizer: {
        type: String,
        required: true,
      },
      StartingDate: {
        type: String,
        required: true,
      },
      EndingDate: {
        type: String,
        required: true,
      },
      Description: {
        type: String,
        required: true,
      },
      InviteCode: {
        type: String,
        required: true,
      },
      EventType: {
        type: String,
        required: true,
      },
      StorageLink: {
        type: String,
        required: true,
      },
      ViewLink: {
        type: String,
        required: true,
      },
      AllowUpload: {
        type: Boolean,
        required: true,
      },
      VisitLate: {
        type: Boolean,
        required: true,
      },
      UploadLate: {
        type: Boolean,
        required: true,
      },
      SubmissionView: {
        type: Boolean,
        required: true,
      },
      Hide: {
        type: Boolean,
        required: false,
        default: false,
      },
      Guests: {
        type: Array,
        required: true,
        default: [],
      },
      Approve: {
        type: Boolean,
        required: true,
        default: false,
      },
      photo: {
        type: String,
        required: true,
        deafult:
          "https://api.emperia.online/images/05663c0c8fdaf5ef551bca5f1c837261.png",
      },
      live: {
        type: String,
        required: true,
        deafult: "false",
      },
      key: {
        type: String,
        deafult: "",
      },
    },
    {strict: false}
  ),
  admin: new Schema(
    {
      ReportType: {
        type: String,
        enum: ["contact", "bug"],
        required: true,
      },
      reporter: {
        UID: {
          type: String,
          required: true,
        },
        Name: {
          type: String,
          required: true,
        },
        Mail: {
          type: String,
          required: true,
        },
      },
      body: {
        type: String,
        required: true,
      },
      TimeReported: {
        type: String,
        required: true,
      },
    },
    {strict: false}
  ),
  sections: new Schema(
    {
      sectionName: {
        type: String,
        required: true,
      },
    },
    {strict: false}
  ),
  Chat: new Schema({
    chatCode: {
      type: String,
      required: true,
    },
    Chat: [
      {
        Name: {
          type: String,
          required: true,
        },
        Message: {
          type: String,
          required: true,
        },
        time: {
          type: String,
          required: true,
        },
      },
    ],
  }),
}
