import { useState, useEffect } from 'react'
import { CircleProgress } from 'react-gradient-progress'
import axiosInstance from '../../utils/axiosInstance'
import Tippy from '@tippyjs/react'
import InvitedUsers from '../modals/invitedModal'
import { Update } from '../../helper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Redirect, useParams } from 'react-router-dom'
import useCookies from '../logic/useCookies'
import '../../styles/Eventoptionbutton.scss'
function Eventoptionbutton(props) {
  const { code } = useParams()
  const { isFaculty, Level } = useCookies()
  const isAdmin = Level?.toLowerCase() === 'admin'
  const [url, setUrl] = useState()
  const [progress, setProgress] = useState()
  const [Data, SetData] = useState()
  const [isOpen, setIsOpen] = useState(false)
  const [upload, setUpload] = useState(false)
  const [ShowUpload, setShowUpload] = useState(false) //* upload late
  const [VisitLate, setVisitLate] = useState(false)
  const [hide, sethide] = useState(false)
  const [view, setView] = useState(false)
  const [Organizer, setOrganizer] = useState(false)
  const guest = Level?.toLowerCase() === 'guest'
  const userModal = InvitedUsers(props.InvitedUser)
  const style = {
    textAlign: 'center',
  }
  let error = JSON.stringify({
    title: 'The events is now deleted.',
    message: "You can't see this event anymore.",
  })
  const modal = withReactContent(Swal)
  //make this only run ONCE
  const submit = async () => {
    const formData = new FormData()
    formData.append('file', Data)
    formData.append('code', props.InviteCode)
    if (upload) {
      axiosInstance.post('/upload/file', formData, {
        headers: {
          'Access-Control-Allow-Origin': 'https://emperia.online',
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: data => {
          // console.log(Math.round((100 * data.loaded) / data.total))
          setProgress(Math.round((100 * data.loaded) / data.total))
        },
      })
    }
  }
  const Delete = async () => {
    const { value: formValues } = await modal.fire({
      title: 'Are you sure you want to delete this event?',
      text: 'This action cannot be undone. The submission will still be saved in your oneDrive.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    })
    if (formValues) {
      // console.log(props.InviteCode, code)
      const result = await axiosInstance.delete(`/api/events/delete/${code}`)
      console.log(result)
      if (result.data.success === false) {
        //set url to /home
        setUrl(`/home?error=${error}`)
      }
    }
  }
  const copyToClipboard = value => navigator.clipboard.writeText(value)
  useEffect(() => {
    setShowUpload(() => {
      if (isFaculty) {
        return props.UploadLate
      } else if (!isFaculty) {
        return new Date(props.EndingDate) <= new Date()
          ? props.UploadLate
          : false
      }
    })
    setView(props.SubmissionView)
    setUpload(props.AllowUpload)
    setVisitLate(props.VisitLate)
    sethide(props.Hide)
    setOrganizer(props.isOrganizer)
    document.title =
      (props.EventName && `${props.EventName} - Emperia`) ?? 'Emperia'
  }, [props])
  useEffect(() => {
    if (Data) {
      submit()
    }
  }, [Data])
  useEffect(() => {
    if (progress === 100) {
      modal.fire({
        title: 'Upload Successful',
        text: 'Your file has been uploaded successfully. it would take time to be seen in the event page.',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 3000,
      })
      SetData(null)
    }
  }, [progress])
  return (
    <div>
      {url && <Redirect to={url} />}
      <div className="collapsible">
        <div className="">
          <h1>{props.EventName || ''}</h1>
          <h2>{props.Description || ''}</h2>
        </div>
        {/* todo : add a condtion here for hide and upload */}
        <div className="buttons">
          {((isFaculty && isAdmin) || Organizer) && props.showSettings ? (
            <>
              <Tippy content={<h4 style={style}>Show Invite Code</h4>}>
                <button
                  className="Btn-Primary"
                  onClick={() => {
                    setIsOpen(!isOpen)
                  }}
                >
                  Show Invite Code
                </button>
              </Tippy>
              <Tippy
                content={
                  <h4 style={style}>
                    Upload is {upload ? 'enabled' : 'disabled'}
                  </h4>
                }
              >
                {/* upload */}
                <button
                  className={upload ? ' Btn-Primary green' : 'Btn-Primary red'}
                  onClick={() => {
                    setUpload(!upload)
                    Update({
                      AllowUpload: !upload,
                      InviteCode: props.InviteCode,
                    })
                  }}
                >
                  Upload
                </button>
              </Tippy>
              {upload && props.EventType == 'Asyncronous Event' && (
                <Tippy
                  content={
                    <h4 style={style}>
                      The users {ShowUpload ? 'can ' : 'can not'} upload late
                    </h4>
                  }
                >
                  {/* Upload Late */}
                  <button
                    className={
                      ShowUpload ? ' Btn-Primary green' : 'Btn-Primary red'
                    }
                    onClick={() => {
                      setShowUpload(!ShowUpload)
                      Update({
                        UploadLate: !ShowUpload,
                        InviteCode: props.InviteCode,
                      })
                    }}
                  >
                    Upload Late
                  </button>
                </Tippy>
              )}
              <Tippy
                content={
                  <h4 style={style}>
                    The Event is {VisitLate ? 'accessible' : 'not accessible'}{' '}
                    after the end date
                  </h4>
                }
              >
                {/* Visit Late */}
                <button
                  className={
                    VisitLate ? ' Btn-Primary green' : 'Btn-Primary red'
                  }
                  onClick={() => {
                    setVisitLate(!VisitLate)
                    Update({
                      VisitLate: !VisitLate,
                      InviteCode: props.InviteCode,
                    })
                  }}
                >
                  Visit Late
                </button>
              </Tippy>
              <button className="Btn-Primary" onClick={userModal}>
                Invited users
              </button>
              {props.EventType === 'synchronous Event' && (
                <Tippy
                  content={
                    <h4 style={style}>
                      The Event is {hide ? 'hidden' : 'not hidden'}
                    </h4>
                  }
                >
                  {/* Hidden */}
                  <button
                    className={hide ? ' Btn-Primary green' : 'Btn-Primary red'}
                    onClick={() => {
                      sethide(!hide)
                      Update({ Hide: !hide, InviteCode: props.InviteCode })
                    }}
                  >
                    Hidden
                  </button>
                </Tippy>
              )}
              <Tippy
                content={
                  <h4 style={style}>
                    The users can {view ? 'see' : 'not see'} other upload
                  </h4>
                }
              >
                <button
                  className={view ? ' Btn-Primary green' : 'Btn-Primary red'}
                  onClick={() => {
                    setView(!view)
                    Update({
                      SubmissionView: !view,
                      InviteCode: props.InviteCode,
                    })
                  }}
                >
                  Allow users to view Submission
                </button>
              </Tippy>
              <Tippy content={<h4 style={style}>Delete the event</h4>}>
                <button className="Btn-Primary red" onClick={() => Delete()}>
                  Delete Event
                </button>
              </Tippy>
              <Tippy
                content={
                  <h4 style={style}>
                    {' '}
                    You are {upload ? 'allowed' : 'not allowed'} to upload
                  </h4>
                }
              >
                <button
                  className={upload ? 'Btn-Primary green' : 'Btn-Primary red'}
                  onClick={() => {
                    //*check if can upload
                    document
                      .getElementById('4ebd0208-8328-5d69-8c44-ec50939c0967')
                      ?.click()
                    console.log('upload clicked')
                  }}
                >
                  Upload File
                </button>
              </Tippy>
            </>
          ) : (
            !guest && (
              <div className="column">
                <Tippy
                  content={
                    <h4 style={style}>
                      {' '}
                      You are {upload ? 'allowed' : 'not allowed'} to upload
                    </h4>
                  }
                >
                  <button
                    className={upload ? 'Btn-Primary green' : 'Btn-Primary red'}
                    onClick={() => {
                      //*check if can upload
                      document
                        .getElementById('4ebd0208-8328-5d69-8c44-ec50939c0967')
                        .click()
                      console.log('upload clicked')
                    }}
                  >
                    Upload
                  </button>
                </Tippy>
              </div>
            )
          )}
          <div className="column">
            {Data && (
              <div>
                <CircleProgress
                  percentage={progress}
                  strokeWidth={12}
                  width={200}
                  secondaryColor="#20509E"
                  fontSize="35"
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={
            isOpen ? 'content-parent show flex' : 'flex content-parent'
          }
        >
          <Tippy content={<h4 style={style}> Click to copy the event code</h4>}>
            <button
              type="button"
              className="Btn-Primary content"
              onClick={() => copyToClipboard(props.InviteCode)}
            >
              {props.InviteCode}
            </button>
          </Tippy>
        </div>
        {upload && (
          <input
            id="4ebd0208-8328-5d69-8c44-ec50939c0967"
            type="file"
            accept="audio/*,video/*,image/*"
            onChange={e => {
              SetData(e.target.files[0])
            }}
            hidden
          />
        )}
      </div>
    </div>
  )
}
export default Eventoptionbutton
