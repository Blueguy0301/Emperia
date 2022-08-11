import Tippy from '@tippyjs/react'
import { useField } from 'formik'
const Toggle = ({
  label,
  left,
  right,
  help,
  isBoolean,
  className,
  buttondisabled,
  ...props
}) => {
  // console.log(buttondisabled)
  const [field, meta] = useField(props)
  if (isBoolean)
    return (
      <div className={`row-2`} id="EventType">
        <Tippy content={<h5>{help || ''}</h5>}>
          <div className="question-circle">
            <i class="fas fa-question-circle"></i>
          </div>
        </Tippy>
        <label id="type"> {label}</label>
        <div className="row-2">
          <h4>{left}</h4>
          <div className={`toggle ${buttondisabled ? 'disabled' : ''}`}>
            <input {...field} {...props} type="checkbox" name={field.name} />
            <label htmlFor={props.id}>toggle</label>
          </div>
          <h4>{right}</h4>
        </div>
      </div>
    )
  else
    return (
      <div className={`row-2`} id="EventType">
        <Tippy content={<h5>{help || ''}</h5>}>
          <div className="question-circle">
            <i class="fas fa-question-circle"></i>
          </div>
        </Tippy>
        <label id="type"> {label}</label>
        <div className="row-2">
          <h4>{left}</h4>
          <div className={`toggle green ${buttondisabled ? 'disabled' : ''}`}>
            <input {...field} {...props} type="checkbox" name={field.name} />
            <label htmlFor={props.id}>toggle</label>
          </div>
          <h4>{right}</h4>
        </div>
      </div>
    )
}
// label left name id right  true/false
export default Toggle
