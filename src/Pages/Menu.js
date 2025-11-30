import React, { useState } from "react";
import "./Styles/Home.css";
import { useNavigate } from "react-router-dom";
import photo from "../Photos/man1.avif"
import AddFriends from "./AddFriends";



export default function Menu({setopen}) {  
    const [back,setback]=useState(false)

    const navigate=useNavigate()
    const userData = JSON.parse(localStorage.getItem("userSigninData"));

    const LogoutAccount = () => {
        localStorage.removeItem("userSigninData");
        navigate("/signin")
    }
    return (
        <>
        {back?(<AddFriends setaddfriends={setback}/>):
    (<div className='one'>
            <div className='logo'>
                <button onClick={() => setopen(false)}>Back</button>
            </div>
            <div className='profile-section'>
                <div className='profile'> <img src={photo} alt={""} className='profile-pic' /></div>
                <div className='name'>{userData ? userData.name : "Guest"}</div>
                <button onClick={() => setopen(false)}>Back</button>
            </div>
            <div className='menu'>
                <button className='menu-btn' onClick={()=> setback(true)}>Add New</button>
                <button className='menu-btn'>Create Group</button>
                <button className='menu-btn'>Join Group</button>
                <button className='menu-btn'>Change profile</button>
                <button className='menu-btn'>Delete Account</button>
                <button className='menu-btn' onClick={()=> LogoutAccount()}>Logout</button>
            </div>
        </div>)}
        </>
  );
}