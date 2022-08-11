import { useEffect, useState, useRef } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Button from '../Button'
import { Redirect } from 'react-router-dom'
import Cookies from 'js-cookie'
import RtmpModals from '../modals/rtmpModals'
function LVFSettings(props) {
  const modal = withReactContent(Swal)
  const [redirect, setRedirect] = useState(false)
  const [key, setKey] = useState('')
  const [rtmpKeys, setRtmpKeys] = useState([])
  const style = { color: 'black' }
  // console.log(props)
  //* mountedref
  let mountedref = useRef()
  useEffect(() => {
    mountedref.current = true
    const data = async () => {
      const temp =
        props &&
        (await axiosInstance.get(`/api/events/generate/streamkey`, {
          params: {
            code: props.InviteCode,
            tempAuth: Cookies.get('tempAuth', { domain: 'emperia.online' }),
          },
        }))
      setKey(temp.data.key)
    }
    props.InviteCode && data()
    return () => {
      mountedref.current = false
    }
  }, [props.InviteCode])
  const endEvent = () => {
    const data = async () => {
      const pressed = await modal.fire({
        title: 'Are you sure you want to end the event?',
        text: 'This will disable live streaming and turn it into an asynchronous event',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, end it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      // todo : add a check to see if the event is live
      if (pressed.value) {
        const { data } = await axiosInstance.post(`/api/events/update`, {
          InviteCode: props.InviteCode,
          EventType: 'Asynchronous Event',
          live: false,
          key: '',
          Ended: true,
        })
        if (data) {
          await modal.fire({
            title: 'Event ended',
            text: 'The event has been ended, we are now redirecting you to the event page',
            icon: 'success',
            showConfirmButton: false,
            timer: 3500,
          })
          setRedirect(true)
        }
      }
    }
    data()
  }
  const otherServices = () => {
    const data = () => {
      modal.fire({
        title: 'Stream to another platform',
        html: <RtmpModals key={key} />,
      })
    }
    data()
  }
  return (
    <div className="LVF-Settings">
      {redirect && <Redirect to={`/event/${props.InviteCode}`} />}
      <div className="LVF-LiveSettings-S">
        <div className="LVF-LiveSettings-IB-T-Content">
          <h2> Event : {props.EventName} </h2>
          <h2>
            About {props.EventName}: {props.Description}
          </h2>
        </div>
        <div className="LVF-LiveSettings-IB-SK-Content">
          <p>
            <b>Stream Key:</b>
          </p>
          <div className="row">
            <h3> Url : </h3>
            <h4 style={style}> rtmp://live.emperia.online/live</h4>
          </div>
          <div className="row">
            <h3> Stream key (password) : </h3>
            <h4 style={style}>{key || 'an error has occured.'}</h4>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="Btn-Primary"
              onClick={() => endEvent()}
            >
              End Event
            </button>
            <button
              type="button"
              className="Btn-Primary"
              onClick={() => otherServices()}
            >
              stream to other services
            </button>
          </div>
          <br />
        </div>
      </div>
    </div>
  )
}

export default LVFSettings
