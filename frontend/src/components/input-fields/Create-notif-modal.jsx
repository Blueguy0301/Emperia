import '../../styles/notifModal.scss'
import Inviteduserbtn from '../../components/Inviteduser-btn'
import useSearch from '../../components/logic/useSearch'
import { useState, useEffect } from 'react'
const notifModal = props => {
  // console.log(props)
  const [members, setMembers] = useState([])
  const [section, setSection] = useState([])
  const [userInput, setUserInput] = useState('')
  const removeMember = indexToRemove => {
    setMembers([...members.filter((_, index) => index !== indexToRemove)])
  }
  const addMember = name => {
    setMembers([...members, name])
    setUserInput('')
  }
  const addSection = name => {
    setSection([...new Set([...section, name])])
    setUserInput('')
  }
  const removeSection = indexToRemove => {
    setSection([...section.filter((_, index) => index !== indexToRemove)])
  }
  const { Loading, Names, error, Data } = useSearch(userInput, members)
  return (
    <div className="notif-modal">
      <div className="title">
        <label htmlFor="title"> Title *</label>
        <input type="text" name="title" id="title" />
      </div>
      <div className="message">
        <label htmlFor="message">Message *</label>
        <textarea name="message" id="message" cols="30" rows="5" />
      </div>
      <div className="to">
        <label style={{ color: 'black' }}> To * </label>
        <input
          type="text"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
        />
        <input
          type="text"
          value={JSON.stringify([...members, ...section])}
          id="to"
          hidden
        />
        <div className="invited-users" id="invited-results">
          {members.length > 0 ? <h3>Users: </h3> : <></>}
          {/* invited */}
          <div className="invited" id="invited-container">
            {members.map((member, index) => {
              return (
                <Inviteduserbtn
                  key={index}
                  id={Data.Mail}
                  name={member}
                  remove={removeMember}
                  index={index}
                  close={true}
                />
              )
            })}
          </div>
        </div>
        <div className="invited-users" id="invited-results">
          {section.length > 0 ? <h3>Sections: </h3> : <></>}
          {/* invited */}
          <div className="invited" id="invited-container">
            {section.map((member, index) => (
              <Inviteduserbtn
                key={index}
                id={Data.Mail}
                name={member}
                remove={removeSection}
                index={index}
                close={true}
              />
            ))}
          </div>
        </div>
        <div className="invited-users">
          {/* search results */}
          <div className="invited" id="invited-results">
            {Data.length > 0 && <h3>Search Results: </h3>}
            {Data &&
              Data.map(Data => {
                if (Data.DisplayName == undefined) return <></>
                else
                  return (
                    <Inviteduserbtn
                      key={Data.DisplayName}
                      id={Data.Mail}
                      addMember={
                        Data.Mail.includes('section') ? addSection : addMember
                      }
                      name={Data.DisplayName}
                    />
                  )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default notifModal
