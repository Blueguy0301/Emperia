import Create_Event_Logic from '../components/logic/Create_Event_Logic'
import { validationSchema, onSubmit } from '../components/logic/useEventFormik'
import { Formik, Form } from 'formik'
import EventForms from '../components/input-fields/Create-Event/EventForms'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
//* css :
import 'sweetalert2/dist/sweetalert2.min.css'
import 'react-datepicker/dist/react-datepicker.css'
import '../styles/create-event.scss'
const Create_Event = () => {
  const MySwal = withReactContent(Swal)
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState()
  let { values } = Create_Event_Logic()
  const initials = {
    ...values,
    EventType: false,
    upload: false,
    late: false,
    hide: false,
    view: false,
  }
  useEffect(() => {
    const modal = async () => {
      hasError &&
        (await MySwal.fire({
          title: 'Error',
          text: error,
          confirmButtonText: `Okay`,
          didOpen: toast => {},
          icon: 'error',
        }))
      setError(null)
    }
    if (error) {
      modal()
    }
  }, [error])
  //* run a myswal when the user clicks submit

  return (
    <div id="EventForm">
      <h1>Create Event</h1>
      <Formik
        initialValues={initials}
        validationSchema={validationSchema}
        onSubmit={async v => {
          //* create a please wait myswal
          await MySwal.fire({
            title: 'Please wait',
            text: 'We are now creating your event!',
            allowOutsideClick: false,
            didOpen: async () => {
              Swal.showLoading()
              const data = await onSubmit(v)
              setHasError(!data.Success)
              setError(data.Reason)
            },
            //disable clicking outside
            willClose: () => {
              Swal.close()
            },
          })
          const data = await onSubmit(v)
          setHasError(!data.Success)
          setError(data.Reason)
        }}
      >
        {EventFormik => (
          <>
            <Form>
              <EventForms options={EventFormik} />
            </Form>
          </>
        )}
      </Formik>
    </div>
  )
}
export default Create_Event
