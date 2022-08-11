//* memory only, make this a high cache
const users = []
//? server
const moment = require("moment")
// Join user to chat
function userJoin(id, username, room) {
  const user = {id, username, room}
  console.log(user)
  users.push(user)
  return user
}

// Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id)
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id)
  // console.log(users[index])
  if (index !== -1) {
    const temp = users[index].room
    users.splice(index, 1)[0]
    return temp
  }
}

// Get room users
function getRoomUsers(room) {
  console.log(users)
  return users.filter((user) => user.room === room)
}

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm:ss a"),
  }
}
module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  formatMessage,
}
