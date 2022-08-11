import Collapsible from 'react-collapsible'
import { useState, useEffect } from 'react'
import AxiosInstance from '../utils/axiosInstance'
import myswal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const collapsible = props => {
  const modal = withReactContent(myswal)
  const [filteredData, setfilteredData] = useState([])
  const [tableData, setTableData] = useState([])
  const { label, url, open, ...rest } = props
  useEffect(() => {
    const data = async () => {
      const information = await AxiosInstance.get(url)
      console.log(information.data)
      setTableData(information.data)
      setfilteredData(information.data)
      console.log(tableData)
    }
    data()
  }, [url])
  const fireModal = async textBody => {
    await modal.fire({
      title: 'About the report',
      html: <h5>{textBody}</h5>,
      icon: 'info',
      confirmButtonText: 'OK',
    })
  }
  // todo : everything here is a table
  return (
    <Collapsible
      trigger={label}
      triggerTagName="button"
      open={open}
      triggerElementProps={{ className: 'Btn-Primary' }}
    >
      <div className="controlpanel">
        <div className="section-creation">
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="basic-addon2"
              onChange={e => {
                if (e.target.value !== '') {
                  const filteredData = tableData.filter(item => {
                    return Object.values(item)
                      .join('')
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                  })
                  setfilteredData(filteredData)
                } else {
                  setfilteredData(tableData)
                }
              }}
            />
          </div>
          <table className="section-table">
            <thead>
              <tr>
                <th scope="col">{props.col1}</th>
                <th scope="col">{props.col2}</th>
                <th scope="col">{props.col3}</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map(data => {
                  return (
                    <tr key={data.id}>
                      <td className="table-name">
                        <h5>{data.reporter.Name}</h5>
                      </td>
                      <td className="table-section">
                        <h5>{data.TimeReported}</h5>
                      </td>
                      <td className="btn-group">
                        <button
                          className="btn Btn-Primary"
                          onClick={async e => fireModal(data.body)}
                          style={{ padding: '0.5em 2.5em' }}
                        >
                          View message
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="3">
                    <h3>No data found</h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Collapsible>
  )
}

export default collapsible
