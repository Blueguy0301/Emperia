//import collapsible
import Collapsible from 'react-collapsible'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  questions,
  answers,
  EOFAQ,
  EOFAQAnswers,
  AFAQ,
  AFAQAnswers,
} from '../components/logic/useQuestions'
import '../styles/faq.scss'
const FaQ = () => {
  const trigger = text => (
    <>
      <h4>{text}</h4>
      <i class="fas fa-caret-down"></i>
    </>
  )
  useEffect(() => {
    window.scrollTo(0, 0)
  })
  return (
    <div className="FAQ">
      <div className="title">
        <h1>Freqently Asked Questions</h1>
        <br />
        <h2>All Users</h2>
      </div>
      <br />
      {questions.map((question, index) => (
        <Collapsible
          trigger={trigger(question)}
          key={index}
          triggerClassName="faq-trigger"
          triggerOpenedClassName="faq-trigger active"
        >
          <div className="FAQ-question">
            <p>{answers[index]}</p>
          </div>
        </Collapsible>
      ))}
      <div className="title-2">
        <h3>Event Organizers</h3>
      </div>
      {EOFAQ.map((question, index) => (
        <Collapsible
          trigger={trigger(question)}
          key={index}
          triggerClassName="faq-trigger"
          triggerOpenedClassName="faq-trigger active"
        >
          <div className="FAQ-question">
            <p>{EOFAQAnswers[index]}</p>
          </div>
        </Collapsible>
      ))}
      <div className="title-3">
        <h3>Admin</h3>
      </div>
      {AFAQ.map((question, index) => (
        <Collapsible
          trigger={trigger(question)}
          key={index}
          triggerClassName="faq-trigger"
          triggerOpenedClassName="faq-trigger active"
        >
          <div className="FAQ-question">
            <p>{AFAQAnswers[index]}</p>
          </div>
        </Collapsible>
      ))}
      <div className="about-btn-bck Btn-Primary">
        <Link to="/">Back</Link>
      </div>
    </div>
  )
}
export default FaQ
