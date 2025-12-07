import React, { useEffect, useState } from 'react';
import "./Styles/FriendRequest.css";

function FriendRequest({ set }) {
    const [acceptload,setacceptload]=useState(false)
    const [mess,setmess]=useState("Accept")
  const [load, setload] = useState(false);
  const [data, setdata] = useState([]);

  const userData = JSON.parse(localStorage.getItem("userSigninData") || "{}");

  const LoadFriendReq = async () => {
    setload(true);
    const id = userData._id;
    try {
      const res = await fetch(`http://localhost:5000/api/users/load/friend/request/${id}`);
      const responseData = await res.json();

      console.log(responseData);
      setdata(Array.isArray(responseData) ? responseData : []);

      setload(false);
    } catch (error) {
      console.log(error);
      setload(false);
    }
  };

  useEffect(() => {
    LoadFriendReq();
  }, []);


  const Accept=async (e)=>{
    setacceptload(true);
    setmess("")
    const userId=userData._id;
    const requesterId=e;
    console.log(userId,requesterId)
    try {
        const res= await fetch("http://localhost:5000/api/users/friend/request/accept",{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ userId, requesterId })
        })
        const data= await res.json()
        if(data){
            setacceptload(false)
            setmess(data.message)
        }
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className='con'>
      <div className='box'>
        <div className='header'>
          <h2 className='title'>Friend Request</h2>
          <button className='back-btn' onClick={() => set(false)}>Back</button>
        </div>

        <div className='body'>
          {load ? (
            <div className='loading'></div>
          ) : data?<div>No Friend Request</div>:(
            data.map((req, index) => (
              <div className='pf' key={index}>
                <img src={req?.fromUser?.profilePic} alt='' className='profile-img' />
                <p className='name'>{req?.fromUser?.name}</p>
                <button className='accept-btn' onClick={()=> Accept(req.fromUser._id)}>{acceptload?<div className='acceptloading'></div>:""}{mess}</button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default FriendRequest;
