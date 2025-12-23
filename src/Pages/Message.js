import React, { useEffect, useState, useContext, useRef } from "react";
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

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [openChat,setopenChat]=useState(false)
  const [sender, setSender] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

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


useEffect(() => {
  if (!receiverId) return;
  // Notify backend that user opened the chat
  socket.emit("chatOpened", { senderId: senderId, receiverId: receiverId });
}, [receiverId]);



useEffect(() => {
  socket.on("messagesSeen", ({ receiverId }) => {
    // Update only messages sent to this receiver
    setMessages(prev =>
      prev.map(msg =>
        msg.receiverId === receiverId ? { ...msg, seen: true } : msg
      )
    );

  });

  return () => {
    socket.off("messagesSeen");
    socket.off("newMessage");
  };
}, []);






  // Receive Messages
  useEffect(() => {
    const handleMessage = (data) => {
      if (isGroupChat) {
        if (data.groupId === groupId) setMessages((prev) => [...prev, data]);
      } else {
        const isCurrentChat =
          (data.senderId === receiverId && data.receiverId === senderId) ||
          (data.senderId === senderId && data.receiverId === receiverId);

        if (isCurrentChat) setMessages((prev) => [...prev, data]);
      }
    };

    socket.on(isGroupChat ? "receiveGroupMessage" : "receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
      socket.off("receiveGroupMessage", handleMessage);
    };
  }, [senderId, receiverId, groupId, isGroupChat]);

  // Load old messages
  useEffect(() => {
    const fetchHistory = async () => {
      if (!senderId || !UserData?._id) return;

      const url = isGroupChat
        ? `http://localhost:5000/api/users/old/group/messages/${groupId}`
        : `http://localhost:5000/api/messages/${senderId}/${receiverId}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("old message data",data)
        setMessages(data || []);
      } catch (err) {
        console.log("History error:", err);
      }
    };

    fetchHistory();
  }, [senderId, UserData, isGroupChat]);

  // Auto-scroll to bottom
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Typing indicator listener
  useEffect(() => {
    const handleTypingEvent = (data) => {
      if (
        (!isGroupChat && data.senderId === receiverId) ||
        (isGroupChat && data.groupId === groupId)
      ) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on("typing", handleTypingEvent);
    return () => {
      socket.off("typing", handleTypingEvent);
    };
  }, [receiverId, groupId, isGroupChat]);

  // Typing indicator sender
  const handleTyping = () => {
    if (!senderId) return;

    // Emit typing start
    socket.emit("typing", { senderId, receiverId, groupId, isGroupChat, isTyping: true });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", { senderId, receiverId, groupId, isGroupChat, isTyping: false });
    }, 2000);
  };

  // Send message
  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (isGroupChat) {
      socket.emit("sendGroupMessage", { senderId, groupId, message });
    } else {
      socket.emit("sendMessage", { senderId, receiverId, message });
    }

    setMessage("");
  };

  return (
    <div className="three">
      {/* Header */}
      <div className="chat-header">
        <img src={alice} alt="" className="chat-user-pic" />
        <div>
          {UserData ? UserData.name : "Select a chat"}
          <p className="online-now">{isGroupChat ? "Group chat" : "Online now"}</p>
        </div>
        <img src={videoCallIcon} alt="" className="chat-icon" />
        <img src={phoneCallIcon} alt="" className="chat-icon" />
      </div>

      {/* Messages */}
      <div className="chat-body">
      <div className="no-messages">{messages.length === 0 ? <div className="no-messages-body">No messages .Start a Converations</div> : null}</div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.senderId === senderId ? "message-r" : "message-s"}>
            {msg.senderId !== senderId && <div className="sender-profile"></div>}
            <div>{msg.message}{msg.senderId===senderId?msg.seen?"--✔✔":"----✔":""}</div>
          </div>
        ))}
        {isTyping && (
           <div className="typing-indicator">
               <span className="typer-name">{UserData?.name || "Someone"}</span>
               <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
            </div>
              )}
        <div ref={bottomRef}></div>
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
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
