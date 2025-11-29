import React, { useEffect, useState } from "react";
import "./Styles/Home.css";
import { socket } from "./socket"; 
import { useContext } from "react";
import { CoustomContext } from "./Context";
import alice from "../Photos/man2.webp";
import videoCallIcon from "../Photos/videoCall.avif";
import phoneCallIcon from "../Photos/callLogo.png";
import Imgadd from "../Photos/ImgAdd.jpg";
import VoiceIcon from "../Photos/voiceAdd.webp";

export default function Message() {

  const {UserData}=useContext(CoustomContext)
  console.log("Receiveduser id",UserData?UserData._id:"")

  const [Sanderid, setSanderid] = useState(null);
  useEffect(() => {
     const LoginData = JSON.parse(localStorage.getItem("userSigninData"));
     setSanderid(LoginData);
     console.log("sanderId:", LoginData ? LoginData._id : "");
     // Join user's private room
      socket.emit("joinRoom", LoginData._id);
  }, []);



  const senderId = Sanderid?Sanderid._id:"";      
  const receiverId = UserData?UserData._id:"";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Listen for messages from backend
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Send message to server
  const handleSend = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      senderId,
      receiverId,
      message,
    });

    setMessage("");
  };



//Old Messages
  useEffect(() => {
    const fetchHistory = async () => {
        if (!senderId || !UserData?._id) return;

        try {
            const response = await fetch(
                `http://localhost:5000/messages/${senderId}/${UserData._id}`
            );
            const data = await response.json();
            setMessages(data); // Save chat history
        } catch (err) {
            console.log("Error fetching history:", err);
        }
    };

    fetchHistory();
}, [senderId, UserData]);





  return (
    <div className='three'>
      {/* Header */}
      <div className='chat-header'>
        <img src={alice} alt="" className='chat-user-pic' />
        {UserData?UserData.name:"Sellect a Person"}<p className='online-now'>Online now</p>
        <img src={videoCallIcon} alt="" className='chat-icon' />
        <img src={phoneCallIcon} alt="" className='chat-icon' />
      </div>

      {/* Messages area */}
      <div className='chat-body'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.senderId === senderId ? "message-r" : "message-s"
            }
          >
            {msg.message}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className='chat-input'>
        <img src={Imgadd} alt="" className='chat-icon' />
        <img src={VoiceIcon} alt="" className='chat-icon' />

        <input
          type='text'
          placeholder='Type a message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
