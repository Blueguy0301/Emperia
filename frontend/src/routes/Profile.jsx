import { useEffect, useState } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import '../styles/Profile.scss'
import axiosInstance from '../utils/axiosInstance'
import Cards from '../components/swiper/Event_Swiper'

function Profile() {
  const { id } = useParams()
  const [Fullname, setFullname] = useState('')
  const [Url, setUrl] = useState('')
  const [Data, setData] = useState({})
  const [Found, setFound] = useState(true)
  useEffect(() => {
    window.scrollTo(0, 0)
    setUrl(id === undefined ? '/api/events/invited' : `/api/events/${id}`)
    const data = async () => {
      const information =
        id === undefined
          ? await axiosInstance.get('/api/profile/user').then(res => res)
          : await axiosInstance.get(`/api/profile/${id}`).then(res => res)
      document.title = `${information.data.Name} - Emperia`
      setFound(information.data.found)
      setFullname(information.data.Name)
      setData(information.data)
      //*fetch buffer and convert to image
      const pic =
        id == undefined
          ? await axiosInstance.get('/api/profile/picture', {
              responseType: 'arraybuffer',
            })
          : await axiosInstance.get(`/api/profile/${id}/photo`, {
              responseType: 'arraybuffer',
            })
      const image = document.getElementById('ProfilePic')
      let arrayBufferView = new Uint8Array(pic.data)
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
    data()
  }, [])
  return (
    <>
      {!Found && <Redirect to="/404" />}
      <div className="profileHeader">
        <div className="profileCover">
          {/* change this */}
          <img src="" alt="" />
          <div className="profileUsers">
            <img id="ProfilePic" alt="" src="/user-solid.svg" />
          </div>
          <div className="profileInfo">
            <h3 className="profileInfoName">{Fullname}</h3>
          </div>
        </div>
        <div className="test">
          <h1>About {Fullname.split(' ')[0]}:</h1>
          <div className="text">
            <p>School email : {Data.Mail}</p>
            <p>Occupacy : {Data.Level}</p>
            <p>Last Login : {Data.LastSeen}</p>
            <p>First Login : {Data.firstLogin}</p>
            <p>Section: {Data.section}</p>
          </div>
          <div className="invited">
            <h1> Invited events : </h1>
            <Cards url={Url} clickable={false} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
