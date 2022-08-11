import React from 'react'

const Record = () => {
  const style= {
    margin: '10px 0 !important',
    maxWidth: '100%',
    }
  return (
    <div className="Record">
      <h3>Please fill out the following information to join the event:</h3>
      <input
        className="swal2-input"
        type="text"
        name="Name"
        id="Name"
        placeholder="Name"
        style={style}
        required
      />
      <input
        className="swal2-input"
        type="text"
        name="School"
        id="School"
        placeholder="School"
        style={style}
        required
      />
    </div>
  )
}

export default Record
