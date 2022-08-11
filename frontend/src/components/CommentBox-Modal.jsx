//added cookies
import { useEffect, useRef, useState } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import Collapsible from 'react-collapsible'
import axiosInstance from '../utils/axiosInstance'
import { io } from 'socket.io-client'
import Cookies from 'js-cookie'
import Linkify from 'react-linkify'
import useCookies from './logic/useCookies'
import '../styles/CommentBox-Modal-styles.scss'
function CommentBoxModal({ code, setViewers, ...props }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const socket = useRef()
  const { userName, isAuth, Level } = useCookies()
  const isGuest = Level?.toLowerCase() === 'guest'
  const eventCode = Cookies.get('code', { domain: 'emperia.online' }) ?? ''
  useEffect(() => {
    socket.current = io('wss://api.emperia.online')
    const data = async () => {
      const isInvited = await axiosInstance.get(`/api/events/isinvited/${code}`)
      console.log(isInvited.data)
      if (isGuest && Level === 'Guest') {
        eventCode === code &&
          socket.current.emit('Join', {
            data: { Name: userName },
            code: code,
          })
      }
      if (Level === 'Student' || Level === 'Faculty' || Level === 'Admin') {
        socket.current.emit('Join', {
          data: { Name: userName },
          code: code,
        })
      }
      const prevMessages = await axiosInstance.get(
        `/api/events/${code}/messages`
      )
      setMessages([
        ...prevMessages.data.map((x, i) => ({
          username: x.Name,
          time: x.Time || i,
          text: x.Message,
        })),
        ...messages,
      ])
      socket.current.emit('getViewers', { code: code })
    }
    data()
    socket.current.on('message', message => {
      // console.log(message)
      setMessages(prevMessage => {
        return [...prevMessage, message]
      })
    })
    socket.current.on('getViewers', data => {
      setViewers(data)
    })
    return () => {
      socket.current.emit('Leave', { code: code })
    }
  }, [])
  const handleSubmit = e => {
    e.preventDefault()
    // Get message text
    if (!newMessage) {
      return false
    }
    socket.current.emit('chatMessage', newMessage)
    setNewMessage('')
  }
  return (
    <Collapsible
      className="CommentBoxModal-collapsible"
      trigger={'Show Chat'}
      triggerWhenOpen="Hide Chat"
      triggerTagName="button"
      open={true}
      triggerElementProps={{ className: 'Btn-Primary' }}
    >
      <div className="CommentBoxModal">
        <div className="CommentBoxModal-BG">
          <br />
          <div className="CommentBoxModal-Body">
            <ScrollableFeed>
              {messages.map(Message => {
                return (
                  <div
                    className="CommentBoxModal-othercomment"
                    key={Message?.time}
                  >
                    <p>
                      {Message?.username} : <Linkify> {Message?.text}</Linkify>
                    </p>
                  </div>
                )
              })}
            </ScrollableFeed>
          </div>
          <div className="CommentBoxModal-Footer">
            <div className="CommentBoxModal-InputBar">
              <input
                type="text"
                className="chatMessageInput"
                placeholder="chat"
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
                value={newMessage}
                id="chat"
              />
              <button
                className="Btn-Primary"
                type="submit"
                onClick={e => handleSubmit(e)}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </Collapsible>
  )
}

export default CommentBoxModal
