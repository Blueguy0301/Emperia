import { useEffect, useState, useRef } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import Button from '../components/Button'
import axiosInstance from '../utils/axiosInstance'
import swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import '../styles/settings.scss'
import ModalKey from '../components/input-fields/modalKey'
import Collapsible from 'react-collapsible'
import Eventoptionbutton from '../components/events/Eventoptionbutton'
import useCookies from '../components/logic/useCookies'
const settings = () => {
  const modal = withReactContent(swal)
  const [key, setkey] = useState('')
  const { code } = useParams()
  const [connected, setConnected] = useState([])
  const [EventData, setEventData] = useState({})
  const [redirect, setRedirect] = useState(false)
  const [Invited, setInvited] = useState([])
  const { Level } = useCookies()
  const isMountedRef = useRef()
  const CopyToClipboard = async (content, title) => {
    navigator.clipboard.writeText(content)
    //show a modal that prompt the user that the text was copied
    await modal.fire({
      title: 'Copied!',
      text: `${title} copied!`,
      icon: 'success',
      timer: 1000,
      showConfirmButton: false,
      //show bar
      timerProgressBar: true,
    })
  }
  //fix streamService. stream key is "streamkey."
  const StreamService = async streamCode => {
    const data = await modal.fire({
      title: 'Stream to other platforms',
      html: <ModalKey />,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      //change color of confirm button
      confirmButtonColor: '#1e519e',
      preConfirm: async () => {
        const url = document.getElementById('url').value
        const streamKey = document.getElementById('streamKey').value
        //check if both fields are filled
        if (url === '' || streamKey === '' || url.includes('rtmp') === false) {
          //if not show an error
          await modal.fire({
            title: 'Error',
            text: '(︶︿︶) There seems to be an error with your input (︶︿︶)',
            icon: 'error',
            timer: 1000,
            showConfirmButton: false,
            //show bar
            timerProgressBar: true,
            //sweet alert close function
            didClose: () => {
              StreamService(streamCode)
            },
          })
          return
        } //if both fields are filled
        const response = await axiosInstance.post(
          `/api/events/generate/add-rtmp`,
          {
            id: key,
            key: streamKey,
            link: url,
          }
        )
        if (response.data.success === true) {
          //add the stream to connected
          console.log(response.data)
          setConnected([...connected, response.data])
          await modal.fire({
            title: 'Success',
            text: `Your stream has been added!`,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
            //show bar
            timerProgressBar: true,
          })
        }
      },
    })
  }
  const DeleteService = async streamCode => {
    //fire a modal
    const data = await modal.fire({
      title: 'are you sure you want to delete this stream?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      //change color of confirm button
      confirmButtonColor: '#1e519e',
    })
    //if the user confirms delete the stream
    if (data.value) {
      //delete the stream
      const result = await axiosInstance.delete(
        `/api/events/generate/remove-rtmp/`,
        {
          params: {
            key,
            dataId: streamCode,
          },
        }
      )
      console.log(result.data)
      //delete the stream from connected
      if (result.data.success === true) {
        const newConnected = connected.filter(stream => {
          console.log(stream)
          return stream.endpointServiceId !== streamCode
        })
        console.log(newConnected)
        setConnected(newConnected)
      }
      //show a modal that the stream has been deleted
      await modal.fire({
        title: 'Stream deleted',
        text: 'The stream has been deleted',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
        //show bar
        timerProgressBar: true,
      })
    }
  }
  const DownloadLogs = async () => {
    const data = await axiosInstance.get(`/api/events/${code}/logs`, {
      accept: '*/*',
    })
    //download the csv file inside data
    const blob = new Blob([data.data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'logs.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  const Trigger = (
    <button type="button" className="Btn Btn-Primary even">
      <i className={'fas fa-cog'} /> {''}
      event Settings
    </button>
  )
  useEffect(() => {
    isMountedRef.current = true
    const data = async () => {
      isMountedRef.current = true
      const datas = await axiosInstance.post(`/api/events/code/${code}`)
      datas.data.EventType === 'Asynchronous Event' && setRedirect(true)
      // console.log(datas.data)
      const temp = await axiosInstance.get(`/api/events/generate/streamkey`, {
        params: {
          code: datas.data.InviteCode,
          tempAuth: Level?.toLowerCase() === 'guest' ? true : false,
        },
      })
      const invited = await axiosInstance.get(
        `/api/events/${code}/invitedUsers`,
        {
          params: {
            Live: datas.data.Live,
          },
        }
      )
      setInvited(invited.data)
      setkey(temp.data.key)
      isMountedRef.current && setEventData(datas.data)
      const endpoints = await axiosInstance.get(
        `/api/events/rtmp/${temp.data.key}`
      )
      setConnected(endpoints.data.endpoints)
      // console.log(endpoints.data)
    }
    data()
    return () => {
      isMountedRef.current = false
    }
  }, [code])
  return (
    <div className="settings">
      {redirect && <Redirect to={`/event/${code}`} />}
      <h1> stream settings</h1>
      <div className="setup">
        <h2>software setup</h2>
        <div className="credentials">
          <div className="flex center content">
            <h3>RTMP server</h3>
            <div className="flex center setup">
              <input
                className="read-only"
                readOnly={true}
                type="text"
                value={'rtmp://live.emperia.online/live'}
              />
              <button
                onClick={() =>
                  CopyToClipboard(
                    `rtmp://live.emperia.online/live`,
                    'rtmp server'
                  )
                }
                className="Btn btn-rounded"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="flex center content">
            <h3>Stream key</h3>
            <div className="flex center setup">
              <input
                readOnly={true}
                type="text"
                value={key}
                className="read-only"
              />
              <button
                type="button"
                onClick={() => CopyToClipboard(key, `stream key`)}
                className="Btn btn-rounded"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="services flex">
            <h3>Other settings</h3>
            <button
              type="button"
              onClick={() => DownloadLogs()}
              className="Btn Btn-Primary even"
            >
              <i class="fas fa-download" /> Download chat logs
            </button>
            <a
              type="button"
              href={`https://live.emperia.online/live/streams/${key}.mp4`}
              download
              className="Btn Btn-Primary even"
            >
              <i class="fas fa-download" /> Download Recorded file
            </a>
          </div>
          <div className="services flex">
            <Collapsible trigger={Trigger}>
              <Eventoptionbutton
                {...EventData}
                showSettings={true}
                InvitedUser={Invited}
              />
            </Collapsible>
          </div>
          <h3>Stream to other services</h3>
          <Button
            content="Stream to another platform"
            normal={true}
            btn={true}
            onClick={() => StreamService(`streamkey`)}
            className="Btn Btn-Primary even"
          />
          <div className="services flex">
            <h2>Connected platforms </h2>
            <div>
              <table className="section-table">
                <thead>
                  <tr>
                    <th>
                      <h3>RTMP Link</h3>
                    </th>
                    <th>
                      <h3>Options</h3>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {connected.length <= 0 ? (
                    <>
                      <tr>
                        <td colSpan={2}>
                          <h3>NO CONNECTED SERVICES</h3>
                        </td>
                      </tr>
                    </>
                  ) : (
                    connected.map(item => {
                      return (
                        <tr key={item.rtmpUrl}>
                          <td>
                            <h5>{item.rtmpUrl}</h5>
                          </td>
                          <td>
                            <Button
                              content="Delete service"
                              normal={true}
                              btn={true}
                              onClick={() =>
                                DeleteService(item.endpointServiceId)
                              }
                              className={'Btn-Primary red'}
                            />
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default settings
