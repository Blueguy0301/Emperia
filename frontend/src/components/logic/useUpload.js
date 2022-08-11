import { useState } from 'react'

const useUpload = ({ code }) => {
  function changeData(e) {
    e.preventDefault()
    SetData(e.target.files[0])
    submit()
  }
  function submit() {
    const formData = new FormData()
    formData.append('file', Data)
    formData.append('code', code)
    axiosInstance.post('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: data => {
        console.log(Math.round((100 * data.loaded) / data.total))
        setProgress(Math.round((100 * data.loaded) / data.total))
      },
    })
  }
  return progress
}
export default useUpload
