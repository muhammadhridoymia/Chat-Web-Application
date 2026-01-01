import React from 'react'
import "./Styles/Viewer.css"

function Viewer({ images, close }) {
  return (
    <div className="viewer">
      <div className="viewer-box">
        <img src={images} alt="" />
        <button className="viewer-close" onClick={() => close(false)}>
          ✕
        </button>
      </div>
    </div>
  );
}

export default Viewer