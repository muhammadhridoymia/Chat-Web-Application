import React from "react";
import "./Styles/Home.css";
import { useNavigate } from "react-router-dom";
import photo from "../Photos/man1.avif"



export default function Menu({setopen}) {  

    const navigate=useNavigate()
    const userData = JSON.parse(localStorage.getItem("userSigninData"));

    const LogoutAccount = () => {
        localStorage.removeItem("userSigninData");
        navigate("/signin")
    }
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
                <button className='menu-btn' onClick={()=> LogoutAccount()}>Logout</button>
            </div>
        </div>
  );
}