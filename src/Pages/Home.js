import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Styles/Home.css'
import { CoustomContext } from './Context'
import { useContext } from 'react'


import Menu from './Menu'
import UserList from './UserList'
import Message from './Message'
import CallScreen from './VoiceCall/CallScreen'

export default function Home() {
  const {showCall}=useContext(CoustomContext)
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
      {showCall?<CallScreen/>:<></>}
      {open?<Menu setopen={setopen}/>:<></>}
      <UserList setopen={setopen}/>
      <Message/>
    </div>
  )
}
