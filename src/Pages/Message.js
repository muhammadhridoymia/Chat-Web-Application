import React, { useEffect, useState } from "react";
import "./Styles/Home.css";
import { socket } from "./socket"; 
import alice from "../Photos/man2.webp";
import videoCallIcon from "../Photos/videoCall.avif";
import phoneCallIcon from "../Photos/callLogo.png";
import Imgadd from "../Photos/ImgAdd.jpg";
import VoiceIcon from "../Photos/voiceAdd.webp";

export default function Message() {

  // Temporary user IDs (later we will make dynamic)
  const senderId = "hridoy123";      
  const receiverId = "alice123";

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

  return (
    <div className='three'>
      {/* Header */}
      <div className='chat-header'>
        <img src={alice} alt="" className='chat-user-pic' />
        Chat with Alice <p className='online-now'>Online now</p>
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
