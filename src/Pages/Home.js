import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Styles/Home.css'

import Menu from './Menu'
import UserList from './UserList'
import Message from './Message'

export default function Home() {
  const navigate=useNavigate();
const [open, setopen] = React.useState(false);


useEffect(()=>{
  const storedUserData = localStorage.getItem("userSigninData");
  if(!storedUserData){
  navigate('/signin');
  }
}, [])


  return (
    <div className='Home'>
      {open?<Menu setopen={setopen}/>:<></>}
      <UserList setopen={setopen}/>
      <Message/>
    </div>
  )
}
