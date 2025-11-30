import React, { useEffect } from "react";
import "./Styles/Home.css";
import notificationIcon from "../Photos/notification.png";
import { useContext } from "react";
import { CoustomContext } from "./Context";



export default function UserList({ setopen }) {  
    const {setUserData}=useContext(CoustomContext)
const [userset, setuserset] = React.useState([]);
const data = JSON.parse(localStorage.getItem("userSigninData"));
const _id = data ? data._id : null;

useEffect(() => {
const user=async()=>{
    const response = await fetch(`http://localhost:5000/api/users/users/${_id}`);
    const data = await response.json();
    console.log(data);
    setuserset(data|| []);
}
user();
}, []);

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
                        <div className="user-item" style={{background:'#04c91e',color:"white",borderRadius:"20px"}}>
                                <img src={""} alt={""} className='user-pic' />
                                <div className='user-name'>Self Message</div>
                        </div>
                        {userset.map((user, index) => (
                            <div key={index} className='user-item' onClick={()=> setUserData(user)}>
                                <img src={user.profilePic} alt={""} className='user-pic' />
                                <div className='user-name'>{user.name}</div>
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