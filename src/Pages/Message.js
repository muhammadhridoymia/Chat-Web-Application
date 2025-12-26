import React, { useEffect, useState, useContext, useRef } from "react";
import "./Styles/Home.css";
import { socket } from "./socket";
import { CoustomContext } from "./Context";

import alice from "../Photos/man2.webp";
import videoCallIcon from "../Photos/videoCall.avif";
import phoneCallIcon from "../Photos/callLogo.png";

export default function Message() {
  const { UserData } = useContext(CoustomContext);

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [sender, setSender] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const [selectedImage, setSelectedImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

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

  // Image select
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedImage(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  // Send message (text + images)
  const handleSend = async (e) => {
    e.preventDefault();
    let imgUrls = [];

    if (selectedImage.length > 0) {
      const formData = new FormData();
      selectedImage.forEach((file) => formData.append("images", file));

      try {
        const res = await fetch("http://localhost:5000/api/users/upload/img", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.urls) imgUrls = data.urls;
      } catch (err) {
        console.log("Image upload failed", err);
        return;
      }
    }

    if (!message.trim() && imgUrls.length === 0) return;

    const msgObj = {
      senderId,
      receiverId,
      groupId,
      message,
      img: imgUrls,
    };

    if (isGroupChat) socket.emit("sendGroupMessage", msgObj);
    else socket.emit("sendMessage", msgObj);

    setMessage("");
    setSelectedImage([]);
    setImagePreview([]);
  };

  // Chat opened
  useEffect(() => {
    if (!receiverId || !senderId) return;
    socket.emit("chatOpened", { senderId, receiverId });
  }, [receiverId, senderId]);

  // Seen messages
  useEffect(() => {
    socket.on("messagesSeen", ({ receiverId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.receiverId === receiverId ? { ...msg, seen: true } : msg
        )
      );
    });

    return () => {
      socket.off("messagesSeen");
    };
  }, []);

  // Receive messages
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

    socket.on(
      isGroupChat ? "receiveGroupMessage" : "receiveMessage",
      handleMessage
    );

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
        setMessages(data || []);
      } catch (err) {
        console.log("History error:", err);
      }
    };

    fetchHistory();
  }, [senderId, UserData, isGroupChat]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Typing indicator
  const handleTyping = () => {
    if (!senderId) return;

    socket.emit("typing", {
      senderId,
      receiverId,
      groupId,
      isGroupChat,
      isTyping: true,
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        senderId,
        receiverId,
        groupId,
        isGroupChat,
        isTyping: false,
      });
    }, 2000);
  };

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
    return () => socket.off("typing", handleTypingEvent);
  }, [receiverId, groupId, isGroupChat]);

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
        {messages.length === 0 && (
          <div className="no-messages-body">
            No messages. Start a conversation
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.senderId === senderId ? "message-r" : "message-s"}
          >
            {msg.senderId !== senderId && (
              <div className="sender-profile"></div>
            )}
            <div>
              {msg.message && <p>{msg.message}</p>}
              {msg.img && msg.img.length > 0 && (
                <div className="message-images">
                  {msg.img.map((imgUrl, i) => (
                    <img key={i} src={imgUrl} alt="sent" className="chat-img" />
                  ))}
                </div>
              )}
              {msg.senderId === senderId ? (msg.seen ? "--✔✔" : "----✔") : ""}
            </div>
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
        <input
          type="file"
          accept="image/*"
          id="imageUpload"
          className="file-input"
          onChange={handleImageChange}
        />
        <label htmlFor="imageUpload" className="add-img-btn">
          📎
        </label>

        <form onSubmit={handleSend} className="message-form">
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

        {imagePreview.length > 0 && (
          <div className="image-preview-container">
            {imagePreview.map((img, index) => (
              <div key={index} className="image-preview">
                <img src={img} alt="" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
