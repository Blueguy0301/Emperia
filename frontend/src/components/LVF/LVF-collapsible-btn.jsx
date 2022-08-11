import React, { useState, useRef } from "react";
import "../../styles/LVF-collapsible-btn.scss";

function Collapsible(props) {
  const [lvfsOpen, setlvfsOpen] = useState(false);
  const parentRef = useRef();
  return (
    <div className="collapsible">
      <button className="Btn-Primary" onClick={() => setlvfsOpen(!lvfsOpen)}>
        {props.label}
      </button>
      <div className="content-parent"
        ref={parentRef}
        style={lvfsOpen ?
          { height: parentRef.current.scrollHeight + 50 + "px", } : { height: "0px" }
        }>
        <div className="content">{props.children}</div>
      </div>
    </div>
  );
}

export default Collapsible;
