//* checked. 02.08
import { useEffect, useState, useRef } from 'react'
import axiosInstance from '../../utils/axiosInstance'
// todo :  check if url is  undefined
const Event_Swiper_Logic = url => {
  const [isLoading, setIsLoading] = useState(true)
  const [Events, setEvents] = useState([])
  const [Empty, setEmpty] = useState(false)
  const isMountedRef = useRef()
  useEffect(() => {
    isMountedRef.current = true
    const data = async () => {
      const Event =
        url &&
        (await axiosInstance.get(url).then(res => {
          return res.data
        }))
      // console.log(Event)
      console.log(Event.empty)
      isMountedRef.current && setEmpty(Event?.empty)
      isMountedRef.current && setEvents(Event?.event)
      isMountedRef.current && setIsLoading(false)
    }
    //check every url every 5000 seconds for updates
    const interval = setInterval(() => {
      !url.includes('upcoming') && isMountedRef.current && data()
    }, 5000)
    data()
    return () => {
      isMountedRef.current = false
      clearInterval(interval)
    }
  }, [url])
  return { Events, isLoading, Empty, isMountedRef }
}
export default Event_Swiper_Logic

//TODO :
// add There is no upcoming events
// modify the loading screens
