import React from "react";
import "./Styles/Home.css";
import photo from "../Photos/man1.avif"



export default function Menu({setopen}) {  
    
    const storedUserData = localStorage.getItem("userSigninData");
    const userData = storedUserData ? JSON.parse(storedUserData) : null;

    return (
    <div className='one'>
            <div className='logo'>
                <button onClick={() => setopen(false)}>Back</button>
            </div>
            <div className='profile-section'>
                <div className='profile'> <img src={photo} alt={""} className='profile-pic' /></div>
                <div className='name'>{userData ? userData.name : "Guest"}</div>
                <button onClick={() => setopen(false)}>Back</button>
            </div>
            <div className='menu'>
                <div className='menu-btn'>menu</div>
                <button className='menu-btn'>Add New</button>
                <button className='menu-btn'>Create Group</button>
                <button className='menu-btn'>Join Group</button>
                <button className='menu-btn'>Change profile</button>
                <button className='menu-btn'>Delete Account</button>
                <button className='menu-btn'>Logout</button>
            </div>
        </div>
  );
}