import axiosInstance from '../../utils/axiosInstance'
import { useState, useEffect, useRef } from 'react'
import useCookies from './useCookies'
const useLiveEnent = (a, code) => {
  const isMountedRef = useRef()
  isMountedRef.current = true
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const [data, setData] = useState({})
  const [live, setLive] = useState('false')
  const { Level } = useCookies()
  //*video js
  useEffect(() => {
    const data = async () => {
      //todo : add title and description on
      const temp = await axiosInstance.get(`/api/events/generate/streamkey`, {
        params: {
          code,
          tempAuth: Level?.toLowerCase() === 'guest',
        },
      })
      setData({
        name: temp.data.EventName,
        desc: temp.data.Description,
        org: temp.data.Organizer,
        isOrg: temp.data.isOrganizer,
        key: temp.data.key,
        live: temp.data.live,
      })
      setLive(temp.data.live)
    }
    data()
    return () => (isMountedRef.current = false)
  }, [])
  return { data }
}
export default useLiveEnent
