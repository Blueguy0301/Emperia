import React from 'react'
import '../../styles/Videocards.scss'
function Videocards(props) {
  return (
    <>  
      <div id='video'>
        <div className='video-image'>
          <img 
          src="/card pic.jpg"
          alt=""
            />
        </div>
        <div className='Video-name'>
            <h2>{props.name}</h2>
        </div>
        <div className='Video-dis'>
          <h4>{props.month}</h4>
          <h4>{props.time}</h4>
          <h4>{props.date}</h4>
        </div> 
      </div>    
    </>
  )
}

export default Videocards