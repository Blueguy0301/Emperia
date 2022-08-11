const axios = require("axios")
const Reqlink = `https://localhost:5443/live/rest/v2/broadcasts`

const data = {
  streamId: "910391234577571307802997",
  status: "finished",
  playListStatus: null,
  type: "liveStream",
  publishType: null,
  name: "test",
  description: null,
  publish: true,
  date: 1650860843345,
  plannedStartDate: 0,
  plannedEndDate: 0,
  duration: 0,
  endPointList: [
    {
      status: "created",
      type: "generic",
      rtmpUrl: "rtmp://example.com/test",
      endpointServiceId: "custombqwXgP",
    },
  ],
  playListItemList: [],
  publicStream: true,
  is360: false,
  listenerHookURL: null,
  category: null,
  ipAddr: null,
  username: null,
  password: null,
  quality: null,
  speed: 0.0,
  streamUrl: null,
  originAdress: "10.0.0.4",
  mp4Enabled: 0,
  webMEnabled: 0,
  expireDurationMS: 0,
  rtmpURL: "rtmp://10.0.0.4/live/910391234577571307802997",
  zombi: false,
  pendingPacketSize: 0,
  hlsViewerCount: 0,
  webRTCViewerCount: 0,
  rtmpViewerCount: 0,
  startTime: 1651063499740,
  receivedBytes: 0,
  bitrate: 0,
  userAgent: "N/A",
  latitude: null,
  longitude: null,
  altitude: null,
  mainTrackStreamId: null,
  subTrackStreamIds: [],
  absoluteStartTimeMs: 0,
  webRTCViewerLimit: -1,
  hlsViewerLimit: -1,
  subFolder: null,
  currentPlayIndex: 0,
  metaData: "",
  playlistLoopEnabled: true,
}
module.exports = {
  createLive: async (name) => {
    let params = {
      name,
      mp4Enabled: 1,
    }
    //stringify params
    params = JSON.stringify(params)
    const request = await axios.post(`${Reqlink}/create`, params, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    // console.log(request.data.streamId)
    return request.data.streamId
  },
  deleteLive: async (id) => {
    const request = await axios.delete(`${Reqlink}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return request.data
  },
  addRTMP: async (link, key, id) => {
    //? link : rtmp link
    //? key : stream key on rtmp link
    //? id : stream id on api.emperia.online
    //? console.log(link, key, id)
    console.log(`link : ${link} key : ${key} id : ${id}`)
    rtmpLink =
      link.substr(-1).includes("/") || link.substr(-1).includes("\\")
        ? `${link}${key}`
        : link + "/" + key
    rtmpLink = await rtmpLink.replace(/\\/g, "/")
    // console.log(rtmpLink)
    const request = await axios.post(`${Reqlink}/${id}/rtmp-endpoint`, {
      rtmpUrl: rtmpLink,
    })
    return {
      rtmpUrl: rtmpLink,
      endpointServiceId: request.data.dataId,
      success: true,
    }
  },
  removeRTMP: async (id, key) => {
    const requstLink = `${Reqlink}/${id}/rtmp-endpoint`
    // console.log(requstLink)
    const request = await axios.delete(requstLink, {
      params: {
        endpointServiceId: key,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
    return request.data
  },
  getRTMP: async (id) => {
    const {
      data: {endPointList},
    } = await axios.get(`${Reqlink}/${id}/`)
    // console.log(endPointList)
    return endPointList
  },
}

// /http://localhost:5080/live/rest/v2/broadcasts/910391234577571307802997
