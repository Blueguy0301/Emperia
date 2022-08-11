import Toggle from "../Toggle";
import 'tippy.js/dist/tippy.css'; // optional

import TextFields from './TextFields'
import { useEffect, useState } from "react";
import { useFormikContext } from 'formik'
const EventForms = (props) => {

    const { setFieldValue } = useFormikContext()
  const formik = props.options
  const [ButtonDisable, setButtonDisable] = useState(formik.values.EventType)
  /* 
    TODO :  (Deadline : today)
    ?If Asyncronous event : 
      *Allow students to upload and view : invited users only
      *hidden : not available
    ?if syncronous event : 
      *Allow student to upload and view : invited users only.
      *upload late : no
      *hidden : available (but guest users are not allowed to upload and view uploaded files.)
  */
  useEffect(() => {
    setButtonDisable(formik.values.EventType)
    //* async event
    if (!formik.values.EventType) {
      setFieldValue('upload', false)
      setFieldValue('hide', false)
      setButtonDisable(true)
    }
    //* sync event
    else {
      setButtonDisable(false)
      setFieldValue('late', true)
    }
  }, [formik.values.EventType,])
  return (
    <div id='forms-event'>
      <TextFields handle={formik} ></TextFields>
      <Toggle
        label="Event Type"
        left="Asyncronous Event"
        name='EventType'
        id="eventType"
        right="syncronous Event"
        isBoolean={true}
        help="Asyncronous Event : A non-live event where users can come and go at their own time.
        Syncronous Event :  A live event that a personnel can go live on a specific date."
      />
      <div className="col">
        <h3> Allow Students to: </h3>
        <div className="row-3">
          <Toggle
            label="Upload"
            left="yes"
            name='upload' id="upload" right="no" isBoolean={false}
            help="Allows the Invited users to upload."
            disabled={!formik.values.EventType}
            buttondisabled={ButtonDisable}
            checked={formik.values.upload}
          />
          <Toggle
            label="Visit after the end date"
            left="yes"
            name='visit' id="visit" right="no" isBoolean={false}
            help="Allows the public and the Invited users to access the event after the end date."
          />
          <Toggle
            label="Upload late"
            left="yes"
            name='late'
            id="late"
            right="no"
            isBoolean={false}
            disabled={formik.values.EventType}
            checked={formik.values.late}
            buttondisabled={!ButtonDisable}
            help="Allows the Invited users to upload past the end date."
          />
          <Toggle
            label="View other submissions"
            left="yes"
            name='view'
            id="view"
            right="no"
            help="Allows the Invited users to view the other people's submission."
            isBoolean={false}
          />
        </div>
        <h3> The Event is: </h3>
        <Toggle
          label="Hidden"
          left="yes"
          name='hide'
          id="hide"
          right="no"
          help="If enabled, only the Invited users are allowed to access the event"
          isBoolean={false}
          disabled={!formik.values.EventType}
          checked={formik.values.hide}
          buttondisabled={ButtonDisable}
        />
      </div>
      <div className="row-2" id="upload" style={{ 'flexDirection': 'column', }}>
        <label htmlFor="banners" style={{ 'outline': 'none', 'width': '100%', 'justifyContent': "center", }} className="banner">
          Event Banner
        </label>
        <input type="file" name='banners' id='banners' accept="image/png, image/jpeg"
          onChange={(event) => {
            const file = event.currentTarget.files[0]
            event.preventDefault()
            formik.setFieldValue("banners", event.currentTarget.files[0]);
          }}
          onSubmit={e => {
            formik.handleSubmit()
          }
          }
        />
      </div>
      <div className="row-2 buttons">
        <button type="submit" id="create-event" className="Btn-Primary">Create Event</button>
        <button type="reset" className="Btn-Primary">reset</button>
      </div>

    </div>
  )
}

export default EventForms