import videojs from 'video.js'
import { useEffect, useRef } from 'react'
//* props = poster, type, link, name, month, time, date,
function Cards({ url, ...props }) {
  const handlePlayerReady = player => {
    playerRef.current = player
    // you can handle player events here
    player.on('waiting', () => {
      console.log('player is waiting')
    })

    player.on('dispose', () => {
      console.log('player will dispose')
    })
  }
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  useEffect(() => {
    const options = {
      autoplay: false,
      controls: true,
      responsive: true,
      poster: '/assets/Logo/NM-512.png',
      fluid: true,
      aspectRatio: '16:9',
      SameSite: 'strict',
      withCredentials: true,
      crossorigin: 'use-credentials',

      //* add headers for credentials with a token bearer
      sources: [
        {
          src: props.data.URL && props.data.URL,
        },
      ],
    }
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current
      if (!videoElement) return
      const player = (playerRef.current = videojs(videoElement, options, () => {
        console.log('player is ready')
        handlePlayerReady && handlePlayerReady(player)
      }))
    } else {
      // you can update player here [update player through props]
      const player = playerRef.current
      player.src(options.sources)
    }
  }, [url])
  if (
    (props.type && props.type.includes('video')) ||
    props.type.includes('audio')
  )
    return (
      <div id="cards">
        <div>
          <div className="Cards-image">
            <div className="" data-vjs-player>
              <video
                ref={videoRef}
                className="video-js vjs-big-play-centered"
              ></video>
            </div>
          </div>
          <div className="Cards-name">
            <h2>{props.name}</h2>
          </div>
          <div className="Cards-dis">
            <h2>{props.month}</h2>
            <h2>{props.time}</h2>
          </div>
        </div>
      </div>
    )
  if (props.type && props.type.includes('image')) {
    return (
      <div id="cards">
        <div>
          <div className="Cards-image">
            <img
              src={props.data.URL || '/assets/Logo/Emperia-192.png'}
              alt=""
              loading="lazy"
            />
          </div>
          <div className="Cards-name">
            <h2>{props.name}</h2>
          </div>
          <div className="Cards-dis">
            <h2>{props.month}</h2>
            <h2>{props.time}</h2>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div id="cards">
        <div>
          <div className="Cards-image unsupported">
            <h3>
              UNSOPPORTED FORMAT. Only common multimedia files are supported.
            </h3>
          </div>
          <div className="Cards-name">
            <h2>{props.name}</h2>
          </div>
          <div className="Cards-dis">
            <h2>{props.month}</h2>
            <h2>{props.time}</h2>
          </div>
        </div>
      </div>
    )
  }
}
export default Cards
