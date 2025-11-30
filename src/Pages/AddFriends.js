import React from 'react'
import "./Styles/AddFriends.css"
function AddFriends(setback) {
  return (
    <div className='addfriends-con'>
        <div className='addfriends-box'>
            <div>
                <button className='cencle-btn' onClick={()=>setback(false)}>X</button>
                <input placeholder='Search Frindes by Mail' className='input-btn'/>
                <button type="submit" className='submit-btn'>Find</button>
            </div>
            <div className='profile-box'>
                <img src='' alt=''/>
                <div>Hridoy </div>
                <button>Frindes Request</button>
            </div>
        </div>
    </div>
  )
}

export default AddFriends