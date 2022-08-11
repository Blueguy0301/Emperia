import React, { useEffect, useState } from 'react';
import '../styles/Loader.scss'

function Loader(props) {
//const [show,setShow] = useState();
const [data, setData] = useState([]);
const [done, setDone] = useState(undefined);
const {content} = props
useEffect(() => {
    fetch('')
    .then((response) => response.json())
    .then((json) => console.log(json));
        setData();
        setDone(true);
});
  return (
    <div>
       {/* {show && */}
        <div className="Loader">
          <div className="Loader-BG">
            <div className="Loader-content">          
              <center>
                <title className="title"><b>{content}</b><br/></title>  
                <br/>
                <div className="Loader-logo">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </center>
            </div>
          </div>
        </div>
        {/* } */}
    </div>
  )};
export default Loader;


