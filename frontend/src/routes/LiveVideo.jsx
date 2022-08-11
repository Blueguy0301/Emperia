import { useState, useEffect, useRef } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import CommentBoxModal from '../components/CommentBox-Modal'
import useLiveEnent from '../components/logic/useLiveEnent'
import Button from '../components/Button'
import axiosInstance from '../utils/axiosInstance'
import '../styles/VLVF-video-style.scss'
import Iframe from 'react-iframe'
import Hide from '../components/events/Hidden'
import Event from './Event'
import useHide from '../components/logic/useHide'
import useCookies from '../components/logic/useCookies'
function VLVFVideo(props) {
  const { code } = useParams()
  const [found, setFound] = useState(false)
  const [live, setLive] = useState(false)
  const { data } = useLiveEnent(live, code)
  const [viewers, setViewers] = useState(0)
  const isMountedRef = useRef()
  const { isFaculty, Level } = useCookies()
  const admin = Level?.toLowerCase() === 'admin'
  const [loading, setLoading] = useState(true)
  const tempAuth = Level?.toLowerCase() === 'guest'
  const { Hidden, Url } = useHide(
    props.interval ? false : true,
    code,
    setLoading,
    isFaculty,
    Level
  )
  useEffect(() => {
    const data = async () => {
      let datas
      if (tempAuth) {
        // console.log('temp auth is true')
        datas = await axiosInstance.get(`/api/events/code/${code}`)
      } else {
        const { data } =
          !found && (await axiosInstance.get(`/api/events/isinvited/${code}`))
        // console.log(data)
        setFound(data.found)
        datas =
          found ||
          (data.found && (await axiosInstance.post(`/api/events/code/${code}`)))
        if (data?.found === false) {
          setRedirect(true)
          setUrl('/home')
        }
        setLive(datas.data.live)
      }
      datas.data.EventType === 'Asynchronous Event' && setRedirect(true)
      datas.data.EventType === 'Asynchronous Event' && setUrl(`/event/${code}`)
    }
    data()
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return (
    <>
      {loading && (
        <div className="loading">
          <div className="loader"></div>
        </div>
      )}
      {Url && <Redirect to={Url} />}
      {!loading && (
        <>
          {Hidden && !admin ? (
            <div id="events">
              <Hide />
            </div>
          ) : (
            <>
              <div className="VLVFVideo">
                <div className="video">
                  {/* make this 16:9 at any screen  size. */}
                  {data.key && (
                    <Iframe
                      src={`https://live.emperia.online:/live/play.html?name=${data.key}`}
                      frameborder="0"
                      allowFullScreen
                    ></Iframe>
                  )}
                </div>
                <div className="chat">
                  <CommentBoxModal code={code} setViewers={setViewers} />
                </div>
                <div className="row">
                  <div className="title">
                    <h4 className="viewers">
                      {` ${viewers} `}
                      <i className="fas fa-eye"></i>
                    </h4>
                    <div className="VLVFContent-description">
                      <h3>{data.name || 'title'} </h3>
                      {(data.isOrg || admin) && (
                        <Button
                          normal={false}
                          to={`/settings/${code}`}
                          content="Stream settings"
                        />
                      )}
                      <h4 className="Organizer">
                        Organized by : {data.org || 'description'}
                      </h4>
                      <h3 className="about">
                        {' '}
                        About {data.name || 'title'} :{' '}
                      </h3>
                      <h4 className="Desc">{data.desc || 'description'} </h4>
                    </div>
                  </div>
                </div>
              </div>
              {!(Level?.toLowerCase() === `guest`) && (
                <Event interval={true} showSettings={false} />
              )}
            </>
          )}
        </>
      )}
    </>
  )
}
//todo : add expiration on cookies
export default VLVFVideo
