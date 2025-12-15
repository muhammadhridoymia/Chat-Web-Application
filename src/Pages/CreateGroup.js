import { useEffect } from "react";
import React from 'react'
import "./Styles/CreateGroup.css";



function CreateGroup() {

    const [loading, setLoading] = React.useState(false);
    const [SellectedFriends, setSellectedFriends] = React.useState([]);
    const [name,setName]=React.useState("");
    const [userset, setuserset] = React.useState([]);
    const data = JSON.parse(localStorage.getItem("userSigninData"));
    const _id = data ? data._id : null;
    
    useEffect(() => {
    const user=async()=>{
        const response = await fetch(`http://localhost:5000/api/users/friends/${_id}`);
        const data = await response.json();
        console.log(data);
        setuserset(data|| []);
    }
    user();
    }, []);
 // add friend to sellected list
    const Toggle = (friendId) => {
        if (SellectedFriends.includes(friendId)) {
            setSellectedFriends(SellectedFriends.filter(id => id !== friendId));
        } else {
            setSellectedFriends([...SellectedFriends, friendId]);
        }
    }

    const CreateGroup=async()=>{
        if(!name.trim() || SellectedFriends.length===0) 
            alert("Please enter a group name and select at least one friend.");
        
       try {
        setLoading(true);
            const response = await fetch("http://localhost:5000/api/users/create/group", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: _id,
                    name,
                    members: SellectedFriends 
                })
            });
            const data = await response.json();
            if (data.message) {
                alert(data.message);
                setName("");
                setSellectedFriends([]);
                setLoading(false);
            } else {
                alert("Failed to create group. Please try again.");
            }
            setLoading(false);
        } catch (error) {
            console.error("Error creating group:", error);
            alert("Failed to create group. Please try again.");
            setLoading(false);
        }
    }
    

  return (
    <div className='con'>
        <div className='con-box'>
            <div className='header'>CreateGroup</div>
            <div className='input-box'>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Group Name" />
                <button className={loading ? "create-btn_loading" : "create-btn"} onClick={CreateGroup}>{loading ? "" : "Create"}</button>
            </div>
            <div className='friend-con'>
                <div className='friend-header'>Add Friends</div>
                <div className='friend-list'>
                    {userset.map((user, index) => (
                        <div key={index} className='friend-box'>
                            <img src={user.profilePic} alt={""} className='friend-pic' />
                            <div className='friend-name'>{user.name}</div>
                            <input type="checkbox" className='friend-checkbox' onClick={(e) => Toggle(user._id)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateGroup