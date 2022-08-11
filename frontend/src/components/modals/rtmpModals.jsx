import React from 'react'
import { useEffect, useState } from 'react'
const rtmpModals = props => {
  const [tableData, setTableData] = useState([])
  return (
    <div className="rtmp-modals">
      <button className="Btn-Primary">add a service</button>
      {tableData.length <= 0 && (
        <h3 style={{ color: 'black' }}> no services added</h3>
      )}
      {tableData.length > 0 &&
        tableData.map((item, index) => {
          return (
            <div key={index}>
              <h1>{item.name}</h1>
              <h1>{item.description}</h1>
            </div>
          )
        })}
    </div>
  )
}

export default rtmpModals
