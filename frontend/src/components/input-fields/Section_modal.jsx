import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
const SectionModal = props => {
  const [Selected, setSelected] = useState()
  const [showText, setshowText] = useState(false)
  const [showList, setshowList] = useState(false)
  const [showUpdate, setshowUpdate] = useState(false)
  const [section, setSection] = useState([])
  useEffect(() => {
    // console.log(props)
    // setshowList(props.update)
    // console.log(Selected)
  }, [Selected])
  //todo : add search function and react-tags here
  return (
    <div>
      {!props.update && (
        <div className="form-group">
          <label htmlFor="section">Section Name: </label>
          <div className="form-group">
            <input
              type="text"
              className="swal2-input"
              id="section"
              name="section"
              placeholder="Section Name"            />
          </div>
        </div>
      )}
      {props.update && (
        <div className="form-group">
          <label htmlFor="section">Section Name: </label>
          <div className="form-group">
            <select
              className="swal2-input"
              id="section"
              name="section"
              onChange={e => setSelected(e.target.value)}
            >
              <option>Select a section</option>
              {props.sections.map(item => (
                <option
                  key={item.id}
                  selected={item.sectionName === props.Section}
                >
                  {item.sectionName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default SectionModal
