import React from 'react'

const ModalKey = () => {
  const style = {
    margin: '10px auto',
    maxWidth: '100%',
  }
  return (
    <>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" id="basic-addon1">
            URL
          </span>
        </div>
        <input
          type="text"
          class="form-control"
          placeholder="rtmp://"
          aria-label="url"
          aria-describedby="basic-addon1"
          id="url"
          className="swal2-input"
          style={style}
        />
      </div>
      <div >
        <div >
          <span id="basic-addon1">
            Stream Key
          </span>
        </div>
        <input
          type="text"
          placeholder="stream key"
          className="swal2-input"
          aria-label="stream key"
          aria-describedby="basic-addon1"
          id="streamKey"
          style={style}

        />
      </div>
    </>
  )
}

export default ModalKey
