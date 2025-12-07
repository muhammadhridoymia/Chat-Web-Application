import React, { useState } from "react";
import "./Styles/AddFriends.css";

function AddFriends({ setaddfriend }) {
    const [reqLoading ,setreqLoading]=useState(false)
    const [reqmess,setreqmess]=useState("Send Friend Request")
  const [message, setMessage] = useState("");
  const [load, setLoad] = useState(false);
  const [friendgmail, setFriendgmail] = useState("");
  const [DATA, setDATA] = useState(null);


  const userData = JSON.parse(localStorage.getItem("userSigninData") || "{}");

  const findFriend = async () => {
    const usergmail = userData.gmail;

    // Prevent searching yourself
    if (usergmail === friendgmail) {
      setMessage("You cannot search yourself.");
      return;
    }
    setLoad(true);
    setMessage("");
    setDATA(null);
    try {
      const res = await fetch(`http://localhost:5000/api/users/find/${friendgmail}`);
      const data = await res.json();
      if (data.users) {
        setDATA(data.users);
      } else {
        setMessage(data.message || "No user found");
      }
    } catch (err) {
      setMessage("Server error");
    } finally {
      setLoad(false);
    }
  };

  const FriendRequest= async()=>{
      setreqLoading(true)
    const fromId=userData._id
    const toId=DATA._id;
    console.log(fromId,toId)
    try {
      const res= await fetch (`http://localhost:5000/api/users/friend/request/`,{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({fromId,toId})
      })
      if(res.json()){
        setreqmess("Succfully Request")
        setreqLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="addfriends-con">
      <div className="addfriends-box">
        <div>
          <button className="cencle-btn" onClick={() => setaddfriend(false)}>
            X
          </button>

          <input
            placeholder="Search Friend by Name/Gamil"
            className="input-btn"
            value={friendgmail}
            onChange={(e) => setFriendgmail(e.target.value)}
          />

          <button type="submit" className="submit-btn" onClick={findFriend}>
            Find
          </button>
        </div>

        {load ? (
          <div className="loading"></div>
        ) : (
          <div className={DATA?"profile-box":""}>
            {DATA ? (
              <>
                <img src={DATA.pic || ""} alt="" />
                <div>{DATA.name}</div>
                <button onClick={()=> FriendRequest()}>{reqLoading?(<div className="loading"></div>):reqmess}</button>
              </>
            ) : (
              <div style={{ color: "red" }}>{message}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddFriends;
