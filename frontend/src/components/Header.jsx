//cookies updated
import '../styles/nav-design.scss'
import { useEffect, useState, useRef } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Redirect } from 'react-router-dom'
import { logout, login } from '../helper'
import { options } from './logic/useResize'
import axiosInstance from '../utils/axiosInstance'
import useCookies from './logic/useCookies'
import { Link } from 'react-router-dom'
const Header = () => {
  const modal = withReactContent(Swal)
  const [url, setUrl] = useState()
  const { Level } = useCookies()
  const isGuest = Level?.toLowerCase() === 'guest'
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [show, setShow] = useState(false)
  const isMounted = useRef()
  //make a fuction that scrolls to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  //using redirect to go to the page so  I can check if the user is logged in or not
  const checkLoggedIn = async link => {
    if (isGuest) {
      const data = await modal.fire({
        title: 'You are not logged in',
        text: 'Please login to continue',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1e519e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel',
      })
      //check if user clicks on confirm button
      if (data.value) {
        login()
      }
    } else {
      setUrl(link)
    }
  }
  useEffect(() => {
    const hasNotif = async () => {
      const { data } = await axiosInstance.get('/api/users/nlength')
      if (data.show) {
        setShow(true)
        return
      }
      setShow(false)
    }
    isMounted.current = true
    isMounted.current && !isGuest && hasNotif()
    isMounted.current && scrollToTop()
    isMounted.current && options()
    window.addEventListener('resize', options)
    return () => {
      window.removeEventListener('resize', options)
      isMounted.current = false
    }
  }, [])
  let Header = (
    <div id="Header">
      {url && <Redirect to={url} />}
      <header id="Header">
        <div className="nav" id="nav">
          <div>
            <div onClick={scrollToTop} className="nav-item logo">
              <img src="/assets/Logo/NM-192.png" alt="" />
            </div>
          </div>
          <div className="flex main" id="main">
            <div className="nav-search option">
              <form action="/search" method="get" className="flex">
                <input
                  type="text"
                  name="s"
                  className="Search"
                  onChange={e => setValue(e.target.value)}
                  placeholder="Search"
                />
                <input
                  type="submit"
                  value="Search"
                  className="Btn-Primary"
                  onClick={e => {
                    e.preventDefault()
                    //check if value is empty
                    if (!value) {
                      modal.fire({
                        title: 'Error',
                        text: 'Enter something to search.',
                        icon: 'error',
                        timer: 1500,
                      })
                    } else {
                      checkLoggedIn(`/search?s=${value}`)
                    }
                  }}
                />
              </form>
            </div>
            <div className="option" sort="2">
              <Link to="/home" className="nav-item">
                Home
              </Link>
            </div>
            <div className="option" sort="3">
              <button
                type="button"
                onClick={() => checkLoggedIn('/profile')}
                className="nav-item"
              >
                Profile
              </button>
            </div>
          </div>
          <div id="dropdown" sort="4">
            <button
              type="button"
              className="nav-item"
              title="other options"
              onClick={() => setOpen(!open)}
            >
              <i className="fas fa-caret-down"></i>
            </button>
          </div>
        </div>
      </header>
      <div className={`dropdown ${open ? 'visible' : ''}`}>
        <div id="options" className="flex"></div>
        <div className="nav-item option" id="logout">
          {show && <div className="pointy"></div>}
          <a type="button" onClick={() => checkLoggedIn('/notifications')}>
            Notifications
          </a>
        </div>
        <div className="nav-item option" id="logout">
          <a
            onClick={() => {
              logout()
            }}
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  )
  return Header
}
export default Header
