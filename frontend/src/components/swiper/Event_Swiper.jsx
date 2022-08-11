//* Import Swiper React components
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
// *Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import '../../styles/Swiper.scss'
//* import Swiper core and required modules
import Event_Swiper_Logic from './Event_Swiper_Logic'
const settings = {
  320: {
    width: 320,
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
      clickable: true,
    },
  },
}
// *install Swiper modules
const Event_Swiper = props => {
  // console.log(props)
  const data = Event_Swiper_Logic(props.url)
  const { isLoading, Events, Empty } = data
  return (
    <div className="Swiper-Container">
      <Swiper
        slidesPerView="auto"
        spaceBetween={50}
        freeMode={true}
        className="mySwiper"
        breakpoints={settings}
      >
        {isLoading && (
          <div className="loading">
            <div className="loader"></div>
          </div>
        )}
        {!Empty ? (
          Events?.map((E, i) => {
            // console.log(E.EventType.toLowerCase() === "syncronous event" ? `/live/${E.code}` : `/event/${E.code}`)
            return (
              <SwiperSlide
                style={{ backgroundImage: `url(${E.photo})` }}
                key={`${E.code} - ${i}`}
              >
                {props.clickable ? (
                  <Link
                    to={
                      E.EventType.toLowerCase() === 'synchronous event'
                        ? `/live/${E.code}`
                        : `/event/${E.code}`
                    }
                    className="SwiperSlide"
                  >
                    <div className="text">
                      <h3>{E.EventName}</h3>
                      <h5>
                        {props.BottomText}{' '}
                        {props.ending ? E.EndingDate : E.StartingDate}
                      </h5>
                    </div>
                  </Link>
                ) : (
                  <a className="SwiperSlide">
                    <div className="text">
                      <h3>{E.EventName}</h3>
                      <h5>
                        {props.BottomText}{' '}
                        {props.ending ? E.EndingDate : E.StartingDate}
                      </h5>
                    </div>
                  </a>
                )}
              </SwiperSlide>
            )
          })
        ) : (
          <div className="flex" style={{ minHeight: '20rem' }}>
            <h3
              style={{
                color: 'black',
                fontSize: '1.5rem',
                margin: 'auto',
                textAlign: 'center',
              }}
            >
              {' '}
              NO EVENTS TO SHOW{' '}
            </h3>
          </div>
        )}
      </Swiper>
    </div>
  )
}
export default Event_Swiper
