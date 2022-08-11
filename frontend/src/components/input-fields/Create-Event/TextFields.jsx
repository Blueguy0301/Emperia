import React, { useState, useEffect } from 'react'
import useSearch from '../../logic/useSearch'
import TextField from '../TextField'
import Inviteduserbtn from '../../Inviteduser-btn'
import { useFormikContext } from 'formik'
const TextFields = props => {
  const { setFieldValue } = useFormikContext()
  const formik = props.handle
  const { Invited } = formik.values
  const [members, setMembers] = useState([])
  const [section, setSection] = useState([])
  const removeMember = indexToRemove => {
    setMembers([...members.filter((_, index) => index !== indexToRemove)])
  }
  const addMember = name => {
    setMembers([...members, name])
    formik.values.Invited = ''
  }
  const addSection = name => {
    setSection([...new Set([...section, name])])
    formik.values.Invited = ''
  }
  const removeSection = indexToRemove => {
    setSection([...section.filter((_, index) => index !== indexToRemove)])
  }
  const { Loading, Names, error, Data } = useSearch(Invited, members)
  useEffect(() => {
    //* adds the members here.
    setFieldValue('invited', members)
    setFieldValue('sections', section)
  }, [members, section])
  return (
    <>
      <TextField
        label="Event Name"
        name="Name"
        type="text"
        minDate=""
        id="Name"
        autoComplete="off"
        help="The Name of the Event"
      />
      <TextField
        label="Starting Date"
        name="Start"
        type="date"
        minDate={new Date()}
        id="Start"
        autoComplete="off"
        help="When will the Event Start?"
      />
      <TextField
        label="Ending Date"
        name="End"
        type="date"
        minDate={new Date() - formik.values.Start}
        id="End"
        autoComplete="off"
        help="When will the Event End?"
      />
      <TextField
        label="Description"
        name="Desc"
        type="text"
        minDate=""
        id="Desc"
        autoComplete="off"
        help="What is this event?"
      />
      <TextField
        label="Invite Code"
        name="code"
        type="text"
        minDate=""
        id="code"
        autoComplete="off"
        help="This is given to the public. They are not allowed to upload and are only allowed to view the event"
      />
      <TextField
        label="Invited"
        name="Invited"
        type="text"
        minDate=""
        id="Invited"
        autoComplete="off"
        help="All invited users are allowed to upload. Invited users are only those within the premises only"
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
    </>
  )
}

export default TextFields
