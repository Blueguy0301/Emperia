//*Style
import '../../styles/Event.scss'
//*components
import Eventoptionbutton from './Eventoptionbutton'
//! /Event
function Event({ cover, data, showSettings, InvitedUser }) {
  return (
    data && (
      <>
        <div className="profilecover">
          <img className="profilecoverImg" src={cover} alt="" />
          <img className="profileImg" src={cover} alt="" />
        </div>
        <Eventoptionbutton
          {...data}
          showSettings={showSettings ?? false}
          InvitedUser={InvitedUser}
        />
      </>
    )
  )
}
export default Event
