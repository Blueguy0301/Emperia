import { useRef, useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance'
import {
  addAdmin,
  createSection,
  deleteSection,
  DeleteWholeSection,
  updateSection,
} from '../components/logic/useSection'
import '../styles/section.scss'
import { UploadCSV } from '../helper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const section = () => {
  const Modal = withReactContent(Swal)
  const handleUpload = () => {
    //click uploadRef
    document.getElementById('csv-file').click()
  }
  const [file, setFile] = useState()
  const [tableData, setTableData] = useState([])
  const [changed, setChanged] = useState(false)
  const [section, setSection] = useState([])
  const [n, setN] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [ShowUploadModal, setShowUploadModal] = useState()
  const [deleteUsers, setdeleteUsers] = useState(false)
  //*fix this. !crucial
  const data = async changed => {
    setLoading(true)
    let update = changed ?? false
    const { data } = await axiosInstance.get('/api/admin/users', {
      params: { pageNumber: n },
    })
    if (n > 1 && !update) {
      setTableData(prevdata => [...prevdata, ...data.query])
      setLoading(false)
      return
    } else if (update) {
      return
    } else {
      setTotalPages(data.total)
      setTableData(data.query)
      setLoading(false)
    }
  }
  const ModalShow = async () => {
    // console.log(ShowUploadModal)
    if (ShowUploadModal.deleteUsers === true) {
      await Modal.fire({
        icon: 'success',
        title: 'Success',
        text: `Successfully Removed ${ShowUploadModal.removed} entries`,
        timer: 10000,
        showConfirmButton: false,
      })
    } else {
      await Modal.fire({
        icon: 'success',
        title: 'Success',
        text: `Successfully added ${ShowUploadModal.added} new users and edited ${ShowUploadModal.edited} users`,
        timer: 10000,
        showConfirmButton: false,
      })
    }
  }
  useEffect(() => {
    data(true)
    setChanged(false)
  }, [changed])

  useEffect(() => {
    const data2 = async () => {
      const { data } = await axiosInstance.get('/api/admin/section')
      setSection(data)
    }
    n > 1 && data2()
    data()
    return () => {
      // setSection([])
      // setTableData([])
    }
  }, [n])
  useEffect(() => {
    const uploadResult = async () => {
      const results = await UploadCSV(file, deleteUsers)
      setShowUploadModal({ ...results.data, deleteUsers })
      setdeleteUsers(false)
    }
    file && uploadResult()
    setFile(undefined)
  }, [file])
  useEffect(() => {
    console.log(ShowUploadModal)
    ShowUploadModal && ModalShow()
    setShowUploadModal()
  }, [ShowUploadModal])
  return (
    <div className="section-creation">
      <h1>Section List</h1>
      <div className="btn-group">
        <button
          type="button"
          className="Btn-Primary"
          onClick={async () => {
            const result = await createSection()
            // console.log(result)
            setSection([...new Set([...section, result])])
            // console.log([...new Set([...section, result])])
          }}
        >
          <i className="fas fa-plus-circle" />
          <p>Create Section</p>
        </button>
        <button
          type="button"
          className="Btn-Primary"
          onClick={() => {
            handleUpload()
            setdeleteUsers(false)
          }}
        >
          <i className="fas fa-upload" />
          <p> Import users via CSV </p>
        </button>
        <button
          type="button"
          className="Btn-Primary"
          onClick={() => {
            handleUpload()
            setdeleteUsers(true)
          }}
        >
          <i className="fas fa-trash-alt" />
          <p> Delete users via CSV </p>
        </button>
        <input
          type="file"
          name="csv-file"
          accept=".csv"
          id="csv-file"
          onChange={e => setFile(e.target.files[0])}
          hidden
        />
        <button
          type="button"
          className="Btn-Primary"
          onClick={async () => {
            const { data, result } = await DeleteWholeSection(section)
            setChanged(data)
            // console.log(section.filter(item => item.sectionName !== result))
            setSection(section.filter(item => item.sectionName !== result))
            // console.log(section.filter(item => item !== result))
          }}
        >
          <i className="fas fa-trash-alt" />
          <p>Delete A Section</p>
        </button>
      </div>
      <div className="search-bar"></div>
      <table className="section-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Section</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData &&
            tableData.map(data => {
              // console.log(data)
              return (
                <tr key={data.id}>
                  <td className="table-name">
                    <h5>{data.name}</h5>
                  </td>
                  <td className="table-section">
                    <h5>{data.section}</h5>
                  </td>
                  <td className="btn-group">
                    <button
                      type="button"
                      className="Btn-Primary"
                      onClick={async () => {
                        setChanged(
                          await updateSection(data.id, data.section, section)
                        )
                      }}
                    >
                      <i className="fas fa-edit" />
                      <p>Edit Section</p>
                    </button>
                    <button
                      type="button"
                      className={`Btn-Primary ${
                        data.section == 'No Section' ? 'gray' : 'red'
                      }`}
                      onClick={async () =>
                        setChanged(
                          await deleteSection(data.name, data.id, data.section)
                        )
                      }
                      disabled={data.section === 'No Section'}
                    >
                      <i className={'fas fa-trash-alt'} />
                      <p>Delete Section</p>
                    </button>
                    <button
                      type="button"
                      className={`Btn-Primary`}
                      onClick={async () =>
                        setChanged(
                          await addAdmin(data.id, data.name, data.Level)
                        )
                      }
                    >
                      <i className={'fas fa-plus-circle'} />
                      <p>
                        {!data.Level?.includes('Admin') ? 'add' : 'remove'} admin
                      </p>
                    </button>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
      <div className="column">
        {loading && (
          <div className="loading">
            <div className="loader"></div>
          </div>
        )}
        {!(n >= totalPages) && (
          <button
            type="button"
            className="Btn-Primary"
            onClick={() => {
              console.log('clicked')
              setN(prev => prev + 1)
              console.log(totalPages)
            }}
            disabled={loading}
          >
            <i className="fas fa-arrow-down" />
            <p>Load More</p>
          </button>
        )}
      </div>
    </div>
  )
}

export default section
