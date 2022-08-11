import DateView from 'react-datepicker'
import Tippy from '@tippyjs/react'
import { useState, useEffect } from 'react'
import { useField, ErrorMessage, useFormikContext } from 'formik'
const TextField = ({ label, minDate, ...props }) => {
  const { setFieldValue } = useFormikContext()
  const [Value, setValue] = useState('')
  const [date, setDate] = useState('')
  const [field, meta] = useField(props)
  useEffect(() => {
    setDate(minDate)
  }, [])

  if (
    props.type.toLowerCase() === 'text' ||
    props.type.toLowerCase === 'password'
  )
    return (
      <>
        <div className="col">
          <div className="row">
            <label htmlFor={field.name}>{label}</label>
            <div className="text-holder">
              <input
                {...field}
                {...props}
                className={`${meta.touched && meta.error && 'incorrect'} ${
                  meta.touched && !meta.error && 'correct'
                }`}
              />
            </div>
            <Tippy content={<h5>{props.help || ''}</h5>}>
              <div className="question-circle">
                <i class="fas fa-question-circle"></i>
              </div>
            </Tippy>
          </div>
          <ErrorMessage name={field.name}>
            {msg => (
              <div className="flex">
                <div className="Background-red">
                  <h3 className="errors">
                    {' '}
                    <i class="fas  fa-info-circle"></i> {msg}
                  </h3>
                </div>
              </div>
            )}
          </ErrorMessage>
        </div>
      </>
    )
  else if (props.type.toLowerCase() === 'date') {
    return (
      <div className="col">
        <div className="row">
          <label htmlFor={field.name}>{label}</label>
          <DateView
            name={field.name}
            id={field.name}
            {...field}
            selected={Value}
            value={Value}
            onChange={e => {
              setValue(e)
              setFieldValue(field.name, e)
            }}
            className={`${meta.touched && meta.error && 'incorrect'} ${
              meta.touched && !meta.error && 'correct'
            }`}
            minDate={date}
          />
          <Tippy content={<h5>{props.help || ''}</h5>}>
            <div className="question-circle">
              <i class="fas fa-question-circle"></i>
            </div>
          </Tippy>
        </div>
        <ErrorMessage name={field.name}>
          {msg => (
            <div className="flex  ">
              <div className="Background-red">
                <h3 className="errors">
                  {' '}
                  <i class="fas  fa-info-circle"></i> {msg}
                </h3>
              </div>
            </div>
          )}
        </ErrorMessage>
      </div>
    )
  }
  return <div>error rendering textFields</div>
}

export default TextField
