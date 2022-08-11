import React, { useState } from 'react'
//*scss
import '../styles/Inviteduser-btn-style.scss'
function Inviteduserbtn(props) {
  return (
    <div className="inviteduser-box flex">
      <div className="invited-button">
        <button
          type="button"
          className="inviteduser-btn"
          onClick={e => {
            props.addMember(props.name)
          }}
          onChange={e => {
            props?.onChange()
          }}
        >
          <div className="inviteduser-box-BG">
            <div className="inviteduser-profile-img">
              {/* <img src="" alt="" />*/}{' '}
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="inviteduser-name">{props.name}</div>
          </div>
        </button>
        {props.close && (
          <div className="inviteduser-close">
            <a
              onClick={() => {
                console.log('clicked')
                props.remove(props.index)
              }}
            >
              <i className="fas fa-times"></i>{' '}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default Inviteduserbtn
