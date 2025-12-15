import React, { useEffect, useState, useContext } from "react";
import "./Styles/Home.css";
import { socket } from "./socket";
import { CoustomContext } from "./Context";

import alice from "../Photos/man2.webp";
import videoCallIcon from "../Photos/videoCall.avif";
import phoneCallIcon from "../Photos/callLogo.png";
import Imgadd from "../Photos/ImgAdd.jpg";
import VoiceIcon from "../Photos/voiceAdd.webp";

export default function Message() {
  const { UserData } = useContext(CoustomContext);

  const [sender, setSender] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Logged-in user
  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("userSigninData"));
    if (loginData?._id) {
      setSender(loginData);
      socket.emit("joinRoom", loginData._id);
    }
  }, []);

  const senderId = sender?._id;
  const isGroupChat = UserData?.type === "group";
  const receiverId = !isGroupChat ? UserData?._id : null;
  const groupId = isGroupChat ? UserData?._id : null;
  console.log("isGroupChat:", isGroupChat);

  //Receive Messages
  useEffect(() => {
    const handleMessage = (data) => {
      if (isGroupChat) {
        if (data.groupId === groupId) {
          setMessages((prev) => [...prev, data]);
        }
      } else {
        const isCurrentChat =
          (data.senderId === receiverId && data.receiverId === senderId) ||
          (data.senderId === senderId && data.receiverId === receiverId);

        if (isCurrentChat) {
          setMessages((prev) => [...prev, data]);
        }
      }
    };

    socket.on(
      isGroupChat ? "receiveGroupMessage" : "receiveMessage",
      handleMessage
    );

    return () => {
      socket.off("receiveMessage", handleMessage);
      socket.off("receiveGroupMessage", handleMessage);
    };
  }, [senderId, receiverId, groupId, isGroupChat]);

  // SEND MESSAGE
  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (isGroupChat) {
      socket.emit("sendGroupMessage", {
        senderId,
        groupId,
        message,
      });
    } else {
      socket.emit("sendMessage", {
        senderId,
        receiverId,
        message,
      });
    }

    setMessage("");
  };
  // LOAD OLD MESSAGES
  useEffect(() => {
    const fetchHistory = async () => {
      if (!senderId || !UserData?._id) return;

      const url = isGroupChat
        ? `http://localhost:5000/api/users/old/group/messages/${groupId}`
        : `http://localhost:5000/api/messages/${senderId}/${receiverId}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        setMessages(data || []);
      } catch (err) {
        console.log("History error", err);
      }
    };

    fetchHistory();
  }, [senderId, UserData, isGroupChat]);

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="three">
      {/* Header */}
      <div className="chat-header">
        <img src={alice} alt="" className="chat-user-pic" />
        <div>
          {UserData ? UserData.name : "Select a chat"}
          <p className="online-now">
            {isGroupChat ? "Group chat" : "Online now"}
          </p>
        </div>
        <img src={videoCallIcon} alt="" className="chat-icon" />
        <img src={phoneCallIcon} alt="" className="chat-icon" />
      </div>

      {/* Messages */}
      <div className="chat-body">
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

      {/* Input */}
      <div className="chat-input">
        <img src={Imgadd} alt="" className="chat-icon" />
        <img src={VoiceIcon} alt="" className="chat-icon" />

        <form onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
