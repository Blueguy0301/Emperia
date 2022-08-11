import { useState, useEffect, useRef } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import useCookies from './useCookies'
//add documentation
const useHide = (isIntervaled, code, setLoading, isFaculty, Level) => {
  let error = JSON.stringify({
    title: 'An error occured.',
    message: "You are trying to access an event you're not invited.",
  })
  const tempAuth = Level?.toLowerCase() === 'guest'
  const admin = Level.toLowerCase() === 'admin'
  const [Cover, setCover] = useState()
  const [Hidden, setHidden] = useState(isFaculty)
  const [Url, setUrl] = useState()
  const [EventData, setEventData] = useState({})
  const [InvitedUser, setInvitedUser] = useState([])
  function UpdateHidden(EndingDate, VisitLate) {
    if (new Date(EndingDate) <= new Date()) {
      if (isFaculty) {
        setHidden(false)
      } else {
        console.log('nag hide sa else')
        setHidden(VisitLate)
      }
    } else {
      console.log('nag hide sa else 2nd')
      setHidden(isFaculty || admin ? false : VisitLate)
    }
  }
  useEffect(() => {
    setLoading(true)
    const data = async () => {
      console.log(tempAuth)
      let datas = await axiosInstance.post(`/api/events/code/${code}`)
      if (!tempAuth) {
        // console.log('not temp auth')
        const res = await axiosInstance.get(`/api/events/isinvited/${code}`)
        if (res.data.found) {
          //* if invited
          // console.log(datas.data)
          if (datas.data.EventType === 'synchronous Event' && isIntervaled) {
            setUrl(`/live/${code}`)
          }
          if (datas.data.isOrganizer || admin) {
            const users = await axiosInstance.get(
              `/api/events/${code}/invitedUsers`,
              {
                params: {
                  Live: res.data.live,
                },
              }
            )
            setInvitedUser(users.data)
          }
          UpdateHidden(datas.data.EndingDate, datas.data.VisitLate)
          setEventData(datas.data)
          setCover(datas.data.photo)
          setLoading(false)
        } else {
          //* if not invited
          console.log('dapat nag run to')
          setUrl(`/home?error=${error}`)
          setLoading(false)
        }
        return
      }
      console.log(datas.data)
      UpdateHidden(datas.data.EndingDate, datas.data.VisitLate)
      setEventData(datas.data)
      setCover(datas.data.photo)
      setLoading(false)
      return
    }
    data()
    // console.log('run Event UseEffect')
    let interval =
      !tempAuth &&
      isIntervaled == true &&
      setInterval(async () => {
        const data = await axiosInstance.get(`api/events/hidden/${code}`)
        setEventData(prevData => ({
          ...prevData,
          ...data.data,
        }))
        // console.log(EventData)
      }, 5000)
    // GetItem()e
    return () => {
      setUrl()
      clearInterval(interval)
    }
  }, [])
  useEffect(() => {
    console.log(`Hidden ${Hidden}`)
  }, [Hidden])

  return { Cover, Hidden, Url, EventData, InvitedUser }
}

export default useHide
