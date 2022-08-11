/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
! do not touch after working or save a working copy. this is for   !
! authentication and https protocols                               !         
! never put db.js here. it will cause errors (circular file error) !
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/
const graph = require('@microsoft/microsoft-graph-client')
const moment = require('moment'),
  save = require('../routes/save'),
  axios = require('axios'),
  fs = require('fs')
require('isomorphic-fetch')
//!IMPORTANT: EVERY RESTART, THE CACHE RESETS, LOG IN AGAIN IF THE SERVER RESTARTED
module.exports = {
  getUserDetails: async function (msalClient, userId) {
    const client = getAuthenticatedClient(msalClient, userId)
    //get information in other words
    const user = await client.api('/me').get()
    // console.log(user)
    return user
  },
  getUserProfile: async function (msalClient, req) {
    const client = getAuthenticatedClient(msalClient, req)
    const user = await client.api('/me/photo/$value').get()
    return user
  },
  getProfilePhoto: async function (msalClient, userId, mail) {
    try {
      const client = getAuthenticatedClient(msalClient, userId)
      const profile = await client.api(`/users/${mail}/photos/240x240/$value`).get()
      return profile
    } catch (e) {
      return null
    }
  },
  //* gets profile information if the user is not yet on the database
  getProfileInfo: async function (msalClient, userId, mail) {
    try {
      const client = getAuthenticatedClient(msalClient, userId)
      const profile = await client.api(`/users/${mail}`).get()
      return { profile, Success: true }
    } catch (e) {
      return { Success: false, error: e }
    }
  },
  GetEvent: async function (link, Code, token) {
    let data = await getDataByToken(link, token)
    const { value } = data
    let time, date, Link
    Link =
      value?.length > 0
        ? value.map(({ createdBy, file, createdDateTime, name }) => {
            let Uploadername = createdBy.user.displayName
            Uploadername = Uploadername.includes('(Student)')
              ? Uploadername.replace('(Student)', '')
              : Uploadername.replace('(Faculty)', '')
            date = moment(new Date(createdDateTime)).format('MMMM Do YYYY')
            time = moment(new Date(createdDateTime)).format('h:mm a')
            return {
              uploader: Uploadername,
              URL: `https://api.emperia.online/media/${Code.toLowerCase()}/${name}`,
              fileType: file.mimeType,
              date,
              time,
            }
          })
        : []
    //sort Link by Date and Time  using mooment
    Link = Link.sort((a, b) => {
      return moment(a.date + ' ' + a.time, 'MMMM Do YYYY h:mm a').diff(
        moment(b.date + ' ' + b.time, 'MMMM Do YYYY h:mm a')
      )
    })

    return Link
  },
  //* post folder, access and shareable link on one drive
  createEvent: async function (msalClient, userId, NewName, mail, code) {
    //* NewName : string , mail : Array
    const client = getAuthenticatedClient(msalClient, userId)
    const email = mail.map(Mail => ({ email: Mail }))
    console.log(email)
    console.log(email.length)
    const driveItem = {
      name: NewName,
      folder: {},
      '@microsoft.graph.conflictBehavior': 'rename',
    }
    const files = await client.api('/me/drive/root/children').post(driveItem)
    const { id } = files
    const parentId = files.parentReference.driveId
    // *make an organization link
    let link = ''
    let permission = {
      type: 'edit',
      scope: 'organization',
    }
    link = await client.api(`/me/drive/items/${id}/createLink`).post(permission)
    // console.log("link yung baba")
    let { webUrl } = link.link
    let encodedWebUrl = `u!${Buffer.from(webUrl).toString('base64')}`
    // console.log(encodedWebUrl)
    //! READ ONLY URL
    const readURL = `/shares/${encodedWebUrl}/driveItem`
    let storageReq = client
      .api(`/shares/${encodedWebUrl}/permission/grant`)
      .post({ recipients: email, roles: ['write'] })
    console.log(storageReq)
    //! UPLOAD ONLY URL
    let storageLink = `/drives/${parentId}/items/${id}:`
    const saveInternal = save.CreateFolder(code)
    //* return two links, one for read and one for write
    return { storageLink, readURL }
  },
  // *Get  files from one drive (private)
  inviteUser: async function (data) {
    let { mail, token, link } = data
    link = link?.split('/')[2]
    // console.log(link)
    const success = await axios.post(`https://graph.microsoft.com/v1.0/shares/${link ?? ''}/permission/grant`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      recipients: [{ email: mail }],
      roles: ['write'],
    })
    if (success.status === 200) {
      return true
    }
    return false
    //todo : put yung may u! dito. using creator token
  },
  //! the user must be invited before being able to upload
  //* Put  data to one drive
  UploadSubmission: async function (msalClient, userId, file, StorageLink, code) {
    // file=file.toObject()
    //* upload link structure  :
    //* drives/parentReference.driveId/items/remoteItem.id
    const client = getAuthenticatedClient(msalClient, userId)
    const result = await Upload(file, client, StorageLink, code)
    return result ? true : false
  },
}
//* get token
function getAuthenticatedClient(msalClient, userId) {
  if (!msalClient || !userId) {
    throw new Error(
      `Invalid MSAL state. Client: ${msalClient ? 'present' : 'missing'}, User ID: ${userId ? 'present' : 'missing'}`
    )
  }
  // Initialize Graph client
  const client = graph.Client.init({
    // Implement an auth provider that gets a token
    // from the app's MSAL instance
    authProvider: async done => {
      try {
        console.log(`dito?`, userId)
        // Get the user's account
        const account = await msalClient.getTokenCache().getAccountByHomeId(userId)
        if (account) {
          // Attempt to get the token silently
          // This method uses the token cache and
          // refreshes expired tokens as needed
          const response = await msalClient.acquireTokenSilent({
            scopes: process.env.permissions.split(','),
            redirectUri: process.env.OAUTH_REDIRECT_URI,
            account: account,
          })
          // First param to callback is the error,
          // Set to null in success case
          done(null, response.accessToken)
        } else {
        }
      } catch (err) {
        console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)))
        done(err, null)
      }
    },
  })
  return client
}
async function Upload(file, client, link, code) {
  //remove spaces on fileName and replace it with _
  const fileName = file.name.replace(/\s/g, '_')
  const totalsize = file.size
  file.name = fileName
  const requestURL = `${link}/${fileName}:/createUploadSession`
  const progress = range => {
    //**  implement the progress callback here
    console.log('uploading range: ', range)
    return true
  }
  const uploadEventHandlers = {
    progress,
  }
  const options = {
    fileName,
    conflictBehavior: 'rename',
    rangeSize: 25600000,
    uploadEventHandlers,
  }
  const payload = {
    item: {
      '@microsoft.graph.conflictBehavior': 'rename',
    },
  }
  const uploadSession = await new graph.LargeFileUploadTask.createUploadSession(client, requestURL, payload)
  const buffer = fs.createReadStream(file.tempFilePath)
  console.log(buffer)
  const fileObject = new graph.StreamUpload(buffer, fileName, file.size)
  //* file object is a binary object that goes straight to onedrive.
  const task = new graph.LargeFileUploadTask(client, fileObject, uploadSession, options)
  console.log(`upploadSession results`)
  const uploadResult = await task.upload()
  console.log(uploadResult.name)
  buffer.close()
  await save.saveFile(code, uploadResult._responseBody.name, file.tempFilePath)
  return uploadResult
}
async function getDataByToken(request, token) {
  console.log('getting data by token')
  // console.log(request)
  const endpoint = `https://graph.microsoft.com/v1.0${request}/children`
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  // console.log("request made to web API at: " + new Date().toString())
  try {
    const response = await axios.get(endpoint, options)
    // console.log(response.data)
    return response.data
  } catch (error) {
    if (error.response.status === 401) {
      console.log('unauthorized')
      return false
    }
    return error
  }
}
//*checked
