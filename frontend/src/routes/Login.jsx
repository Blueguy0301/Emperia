import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Parallax } from 'react-parallax'
import '../styles/login.scss'
import {
  joinModals as joinModals,
  LoginModal,
} from '../components/modals/joinModal'
import { Redirect, Link } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
const Login = () => {
  const [isVisible, setIsVisible] = useState(0)
  const [isVisible2, setIsVisible2] = useState(0)
  const [isVisible3, setIsVisible3] = useState(0)
  const [url, setUrl] = useState()
  const Join = joinModals(true, setUrl)
  const loginUser = LoginModal()
  useEffect(() => {
    // console.log(url)
    const data = async () => {
      const res = await axiosInstance.get('/api/home')
      console.log(res)
    }
  }, [url])
  return (
    <div className="Login">
      {url && <Redirect to={url} />}
      <Parallax
        // blur={{ min: 4, max: 0 }}
        strength={500}
        bgImage="/assets/login/login-parallax-1.svg"
        bgClassName="bg-custom"
      >
        <div className="content">
          <img src="/assets/Logo/Emperia-512.png" alt="" />
          {/* <h1>Emperia</h1> */}
          <h3>Event Management Platform</h3>
          <div className="btn-group flex">
            <button
              className="Btn Btn-Primary"
              type="button"
              onClick={loginUser}
            >
              Login
            </button>
            <button className="Btn Btn-Primary" type="button" onClick={Join}>
              Join using invite code
            </button>
          </div>
          <div className="waves">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#78E7F6"
                fillOpacity="1"
                d="M0,96L48,90.7C96,85,192,75,288,80C384,85,480,107,576,138.7C672,171,768,213,864,192C960,171,1056,85,1152,85.3C1248,85,1344,171,1392,213.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>
      </Parallax>
      <Parallax
        renderLayer={percentage => {
          return setIsVisible(percentage)
        }}
        bgImage="/assets/login/login-parallax-2.svg"
        bgClassName="bg-custom"
        strength={300}
      >
        <div className="content" style={{ opacity: isVisible }}>
          <div className="column">
            <h2>Why Emperia?</h2>
            <h3>
              <span> ἐμπειρία </span>
            </h3>
            <h4>/em.peː.rí.aː/</h4>
            <h4> A greek word, meaning experience.</h4>
          </div>
        </div>
      </Parallax>
      <Parallax
        bgImage="/assets/login/login-parallax-2.svg"
        bgClassName="bg-custom"
        strength={500}
        renderLayer={percentage => {
          return setIsVisible2(percentage)
        }}
      >
        <div className="content" style={{ opacity: isVisible2 }}>
          <h3> What does Emperia do?</h3>
          <div className="feature">
            <h4>
              <span>
                <i className="fas fa-check"> </i>
              </span>{' '}
              Organize events both syncronously and asyncronously.
            </h4>
            <h4>
              <span>
                <i className="fas fa-check"> </i>
              </span>{' '}
              Stream to other platforms while streaming on our site.
            </h4>
            <h4>
              <span>
                <i className="fas fa-check"> </i>
              </span>{' '}
              OneDrive and Office365 integration
            </h4>
            <h4>
              <span>
                <i className="fas fa-check"> </i>
              </span>{' '}
              Private streaming
            </h4>
            <h4>
              <span>
                <i className="fas fa-times"> </i>
              </span>{' '}
              Know your breakfast
            </h4>
          </div>
        </div>
      </Parallax>
      <Parallax
        bgImage="/assets/login/login-parallax-3.svg"
        bgClassName="bg-custom"
        renderLayer={percentage => {
          return setIsVisible3(percentage)
        }}
      >
        <div className="content" style={{ opacity: isVisible3 }}>
          <h3> Want to learn more?</h3>
          <div className="btn-group flex">
            <Link to="/about-us" className="Btn Btn-Primary">
              About the Developers
            </Link>
            <Link to="/faq" className="Btn Btn-Primary">
              View FAQ
            </Link>
          </div>
        </div>
      </Parallax>
    </div>
  )
}

export default Login
