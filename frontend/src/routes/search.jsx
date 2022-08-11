import { useEffect, useRef, useState, createRef } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { Redirect, Link } from 'react-router-dom'
import useQuery from '../components/logic/useQuery'
import '../styles/search.scss'
const search = () => {
  const query = useQuery()
  const search = query.get('s')
  const isMounted = useRef()
  const imageRef = useRef([])
  const [People, setPeople] = useState([])
  const [Events, setEvents] = useState([])
  const [Loading, setLoading] = useState(true)
  const [Search, setSearch] = useState(search)
  const [UserFound, setUserFound] = useState(false)
  const [EventFound, setEventFound] = useState(false)
  const response = async () => {
    setUserFound(false)
    setEventFound(false)
    setPeople([])
    setEvents([])
    setLoading(true)
    const { data, headers } = await axiosInstance.get(
      `/api/users/search?s=${search}`
    )
    if (data.users.length > 0) setUserFound(true)
    if (data.events.length > 0) setEventFound(true)
    setEvents(data.events)
    setPeople(data.users)
    console.log(data.users)
    imageRef.current = await data.users.map((element, i) => {
      return imageRef.current[i] ?? createRef()
    })
    await data.users.map((element, i) => photourl(element.Mail, i))
    data && setLoading(false)
  }
  const photourl = async (url, i) => {
    //todo : save this to cache if ever
    const { data } = await axiosInstance.get(`/api/profile/${url}/photo`, {
      responseType: 'arraybuffer',
    })
    const image = imageRef.current[i].current
    let arrayBufferView = new Uint8Array(data)
    let blob2 = new Blob([arrayBufferView], { type: 'application/json' })
    const fr = new FileReader()
    fr.onload = e => {
      try {
        const noPhoto = JSON.parse(e.target.result) || false
        if (noPhoto) {
          image.src = '/user-solid.svg'
        }
      } catch (error) {
        let blob = new Blob([arrayBufferView], { type: 'image/jpeg' })
        let imageUrl = URL.createObjectURL(blob)
        image.src = imageUrl
      }
    }
    fr.readAsText(blob2)
  }
  useEffect(() => {
    isMounted.current = true
    //get x-total-count
    document.title = isMounted.current && 'Search - Emperia'
    // console.log(search)
    search !== '' && response()
    search !== '' && setSearch(search)
    return () => {
      isMounted.current = false
    }
  }, [query])
  return (
    <div className="search">
      <h1>Search results for {Search}</h1>
      <div className="results">
        <div className="people">
          <h2>People</h2>
          {Loading ? (
            <div className="loading">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {!UserFound && <h3>No results found</h3>}
              {People &&
                People.map((person, i) => {
                  return (
                    <Link
                      to={`/profile/${person.Mail}`}
                      key={`${person.Name}-${i}`}
                    >
                      <div className="person">
                        <img
                          alt="avatar"
                          src="/user-solid.svg"
                          ref={imageRef.current[i]}
                          lazyload="true"
                        />
                        <div className="name">
                          <h3>{person.Name}</h3>
                          <h4>{person.Section}</h4>
                        </div>
                      </div>
                    </Link>
                  )
                })}
            </>
          )}
        </div>
        <div className="events">
          <h2>Events</h2>
          {Loading ? (
            <div className="loading">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {!EventFound && <h3>No results found</h3>}
              {Events &&
                Events.map((event, i) => (
                  <Link
                    to={`/${
                      event.EventType == 'Asynchronous Event' ? 'event' : 'live'
                    }/${event.InviteCode}`}
                    key={`${event.Name}${i}`}
                  >
                    <div className="event">
                      <div className="banner">
                        <img src={event.photo} alt="banner" />
                      </div>
                      <div className="name">
                        <h3>{event.EventName}</h3>
                        <h4>{event.description}</h4>
                      </div>
                    </div>
                  </Link>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default search
