import React from "react";
import photo from "../Photos/man1.avif"
import alice from "../Photos/man2.webp"
import bob from "../Photos/woman1.avif"
import charlie from "../Photos/woman2.webp"
import "./Styles/Home.css";
import notificationIcon from "../Photos/notification.png";

export default function UserList({ setopen }) {  

    const user =[
    {name: 'Alice', profilePic: alice},
    {name: 'Bob', profilePic: bob},
    {name: 'Charlie', profilePic: charlie},   
    {name: 'Diana', profilePic: photo},
    {name: 'Alice', profilePic: alice},
    {name: 'Bob', profilePic: bob},
    {name: 'Charlie', profilePic: charlie},   
    {name: 'Diana', profilePic: photo},
    {name: 'Alice', profilePic: alice},
    {name: 'Bob', profilePic: bob},
    {name: 'Charlie', profilePic: charlie},   
    {name: 'Diana', profilePic: photo},
    {name: 'Alice', profilePic: alice},
    {name: 'Bob', profilePic: bob},
    {name: 'Charlie', profilePic: charlie},   
    {name: 'Diana', profilePic: photo},
    {name: 'Alice', profilePic: alice},
    {name: 'Bob', profilePic: bob},
    {name: 'Charlie', profilePic: charlie},   
    {name: 'Diana', profilePic: photo},
    {name: 'Alice', profilePic: alice},
    {name: 'Bob', profilePic: bob},
    {name: 'Charlie', profilePic: charlie},   
    {name: 'Diana', profilePic: photo},
]


    return (
    <div className='two'>
            <div>
                <div className='chat-header'>
                    <div onClick={() => setopen(true)}>☰</div>
                    <div><img src={notificationIcon} alt="Notifications" className="icon" /></div>

                </div>
                <input type="text" placeholder='Search...' className='search-bar' />
                <div className='active'>
                    <div className='active-user'>
                        {user.map((usr, index) => (
                            <div key={index} className='user-item'>
                                <img src={usr.profilePic} alt={""} className='user-pic' />
                                <div className='user-name'>{usr.name}</div>
                                <div className='user-status'> online</div>
                            </div>
                        ))}
                    </div>
                    <div className='settings'>Settings</div>
                    
                </div>
            </div>
        </div>
  );
}   