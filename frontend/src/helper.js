import axiosInstance from './utils/axiosInstance'
export const login = async () => {
  axiosInstance
    .post('/auth/signin', {})
    .then(response => {
      window.location.replace(response.data)
    })
    .catch(function (err) {
      console.info(err + ' url: ' + url)
    })
  //add two numbers
}
export const check = async code => {
  const success = await axiosInstance.get(`/api/events/code/${code}`)
  console.log(success.data)
  if (success.data.redirect) {
    return success.data.redirect
    // window.location.href = `https://emperia.online/info/${code}`
  } else {
    return success.data.redirect
  }
}
export const addGuest = async ({ Name, School }, Code) => {
  const add = await axiosInstance.post('/api/events/guest', {
    Name,
    School,
    Code,
  })
  return add.data.redirect && `/live/${Code}`
}
export const logout = async () => {
  const logout = await axiosInstance.post('/auth/signout').then(res => {
    window.location.replace(res.data.redirect)
  })
}
export const submit = async data => {
  const formData = new FormData()
  // todo : seperate sections from persons
  //* Note : For Booleans, True == false , false == true (on raw format)
  const {
    banners,
    Name,
    Start,
    End,
    Desc,
    invited,
    code,
    EventType,
    upload,
    visit,
    late,
    hide,
    view,
    sections,
  } = data
  //* Image file
  formData.append('banners', banners)
  //*Textfields
  formData.append('Name', Name)
  formData.append('Start', Start)
  formData.append('End', End)
  formData.append('Desc', Desc)
  formData.append('code', code)
  //* invited (array)
  formData.append('sections', JSON.stringify(sections))
  // console.log(Invited)
  formData.append('Invited', JSON.stringify(invited))
  //* allow students to upload
  formData.append('upload', !upload)
  //* event type : !false == Snycronous, !true == Asyncronous
  formData.append('EventType', !EventType)
  //* visit after the end date
  formData.append('visit', !visit)
  //* Upload late
  formData.append('late', !late)
  //* Hidden
  formData.append('hide', !hide)
  //*View other submissions
  formData.append('view', !view)
  const params = {
    data: formData,
    headers: {
      'content-type': 'multipart/form-data',
    },
  }
  const response = await axiosInstance
    .post('/api/create-events/', formData, params)
    .catch(e => console.log(e))
  if (response.data.Success) {
    //* Redirect to the event page
    window.location.href = `https://emperia.online${response.data.Redirect}`
  } else {
    return response.data
  }
}
export const profile = async () => {
  return await fetch('/api/user/picture')
}
export const sendNotif = async (users, notif) => {
  console.log(users, notif)
  //console.log(users, notif)
  const result = await axiosInstance.post(
    '/api/admin/notif',
    { users: JSON.parse(users), notif },
    {
      headers: {
        'content-type': 'application/json',
      },
    }
  )
  return 'done'
}
export const Search = async input => {
  const uri = `/api/search/user/${input}`
  const data = await axiosInstance
    .get(uri)
    .then(res => res.json())
    .then(res => console.log(res))
  return data
}
export const Update = async data => {
  console.log(data)
  const response = await axiosInstance
    .post('/api/events/update', data)
    .catch(e => console.log(e))
  return response
}
export const accept = async data => {
  const response = await axiosInstance
    .post('/api/users/accept', data)
    .catch(e => console.log(e))
  return response
}
export const addRTMP = async data => {
  const response = await axiosInstance
    .post('/api/events/generate/add-rtmp', data)
    .catch(e => console.log(e))
  return response
}
export const removeRtmp = async data => {
  const response = await axiosInstance
    .post('/api/events/generate/remove-rtmp', data)
    .catch(e => console.log(e))
  return response
}
export const UploadCSV = async (file, Delete) => {
  console.log(Delete)
  const formData = new FormData()
  formData.append('csv', file)
  const response = await axiosInstance.post('/upload/csv', formData, {
    params: {
      Delete: Delete,
    },
  })
  console.log(response)
  return response
}
