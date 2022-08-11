import EventHeader from '../components/events/Event'
import Cardslist from '../components/events/Cardlist'
import Hide from '../components/events/Hidden'
import { useState } from 'react'
import { useParams, Redirect } from 'react-router-dom'
//*css :
import '../styles/Cards.scss'
import 'video.js/dist/video-js.css'
import useHide from '../components/logic/useHide'
import useCookies from '../components/logic/useCookies'
function Event(props) {
  const { Level, isFaculty } = useCookies()
  const admin = Level?.toLowerCase() === 'admin'
  const [loading, setLoading] = useState(true)
  const { code } = useParams()
  const { Cover, Hidden, Url, EventData, InvitedUser } = useHide(
    props.interval ? true : false,
    code,
    setLoading,
    isFaculty,
    Level
  )
  return (
    <>
      {Url && <Redirect to={Url} />}
      {loading && (
        <div className="loading">
          <div className="loader"></div>
        </div>
      )}
      {!loading &&
        (Hidden && !admin ? (
          <div id="events">
            <Hide />
          </div>
        ) : (
          <div id="events">
            <EventHeader
              cover={Cover}
              data={EventData && EventData}
              showSettings={props.showSettings ?? true}
              InvitedUser={InvitedUser}
            />
            <Cardslist
              data={EventData && EventData}
              code={code}
              isFaculty={isFaculty}
            />
          </div>
        ))}
    </>
  )
}
export default Event
