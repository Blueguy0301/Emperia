//* Checked MODFIFY THIS TO BE PERFORMANT AND RELIABLE
import { useState } from 'react'
const Create_Event_Logic = () => {
  const [Name, setName] = useState('')
  const [Start, setStart] = useState('')
  const [End, setEnd] = useState('')
  const [Desc, setDesc] = useState('')
  const [Invited, setInvited] = useState('')
  const [code, setcode] = useState('')
  const [EventType, setEventType] = useState(false)
  const [upload, setUpload] = useState(true)
  const [visit, setVisit] = useState(true)
  const [late, setLate] = useState(true)
  const [Success, SetSuccess] = useState(false)
  const [Reason, SetReason] = useState('')
  const values = {
    Name,
    Start,
    End,
    Desc,
    Invited,
    code,
    EventType,
    upload,
    visit,
    late,
    banners: undefined,
  }
  return { values }
}

export default Create_Event_Logic
