import Toggle from '../components/input-fields/Toggle'
import '../styles/Contact.scss'
import { useState, useEffect, useRef } from 'react'
import { Formik, Form } from 'formik'
import useReport from '../components/logic/useReport'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Tippy from '@tippyjs/react'

function Contact() {
  const isMounted = useRef()
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])
  return (
    <div className="contact column">
      <div className={`row-2`} id="EventType">
        <Tippy content={<h5>What kind of report are you submitting?</h5>}>
          <div className="question-circle">
            <i class="fas fa-question-circle"></i>
          </div>
        </Tippy>
        <label id="type"> Report type</label>
        <div className="row-2">
          <h4>Support</h4>
          <div className={`toggle`}>
            <input id="reportType" type="checkbox" name="reportType" />
            <label htmlFor="reportType" style={{ fontSize: '1.25em' }}>
              toggle
            </label>
          </div>
          <h4>Bug</h4>
        </div>
      </div>
      <label htmlFor="userName">Tell us more: </label>
      <textarea type="text" name="reportDetails" id="reportDetails" />
      <input type="submit" style={{ display: 'none' }} id="submit" />
    </div>
  )
}
export default Contact
