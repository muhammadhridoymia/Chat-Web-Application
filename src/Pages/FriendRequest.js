import React, { useEffect, useState } from 'react';
import "../Styles/FriendRequest.css";

function FriendRequest({ set }) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState({});
  const [acceptMessages, setAcceptMessages] = useState({});
  const userData = JSON.parse(localStorage.getItem("userSigninData") || "{}");


  // Load friend requests
  const loadFriendReq = async () => {

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/load/friend/request/${userData._id}`);
      const responseData = await res.json();
      setData(Array.isArray(responseData) ? responseData : []);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadFriendReq();
  }, []);

  // Accept friend request
  const accept = async (requesterId) => {
    setAcceptLoading(prev => ({ ...prev, [requesterId]: true }));
    setAcceptMessages(prev => ({ ...prev, [requesterId]: "" }));
    try {
      const res = await fetch("http://localhost:5000/api/users/friend/request/accept", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData._id, requesterId })
      });
      const response = await res.json();
      setAcceptMessages(prev => ({ ...prev, [requesterId]: response.message }));
      // Optional: reload requests after accepting
      loadFriendReq();
    } catch (error) {
      console.log(error);
      setAcceptMessages(prev => ({ ...prev, [requesterId]: "Error" }));
    }
    setAcceptLoading(prev => ({ ...prev, [requesterId]: false }));
  };

  return (
    <div className='con'>
      <div className='box'>
        <div className='header'>
          <h2 className='title'>Friend Request</h2>
          <button className='back-btn' onClick={() => set(false)}>Back</button>
        </div>

        <div className='body'>
          {loading ? (
            <div className='loading'></div>
          ) : data.length === 0 ? (
            <div className='no-requests'>No Friend Request</div>
          ) : (
            data.map((req) => (
              <div className='pf' key={req._id}>
                <img 
                  src={req?.fromUser?.profilePic || "/default-profile.png"} 
                  alt='' 
                  className='profile-img' 
                />
                <p className='name'>{req?.fromUser?.name}</p>
                <button 
                  className='accept-btn' 
                  onClick={() => accept(req.fromUser._id)}
                >
                  {acceptLoading[req.fromUser._id] ? <div className='acceptloading'></div> : ""}
                  {acceptMessages[req.fromUser._id] || "Accept"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendRequest;
