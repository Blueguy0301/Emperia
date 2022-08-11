
import '../../styles/Social.css'
function Eventoptionbutton(props) {
import { useState} from 'react';

function Social() {
  const [show,setShow] = useState(false)
  return <div>
       <button className='btn'onClick={()=>setShow(!show)}>Edit</button>
        
       {show?<div className='Container'>
               <div className='fade-in'>
                  <div className='Edit'>
                      <p>Facebook:</p>
                      <input type="text" placeholder='Type here' />
                      <p>Twitter:</p>
                      <input type="text" placeholder='Type here' />
                      <p>Instagram:</p>
                      <input type="text" placeholder='Type here' />
                      <button className='S'>Save</button>
                      <button className='C' onClick={()=>setShow(!show)}>close</button>
                  </div>
               </div>
        </div>:null}
        
  </div>;
}

export default Social;
