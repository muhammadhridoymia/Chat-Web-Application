import React, { useEffect, useState, useContext, useRef } from "react";
import "../Styles/Home.css";
import { socket } from "./socket";
import { CoustomContext } from "./Context";
import CallScreen from "../Pages/VoiceCall/CallScreen";
import Viewer from "./Viewer";

import alice from "../Photos/man2.webp";
import videoCallIcon from "../Photos/videoCall.avif";
import phoneCallIcon from "../Photos/callLogo.png";
import voiceIcon from "../Photos/voiceIcon.png";

export default function Message() {
  const { UserData,setTo,setFrom ,showCall,setshowCall} = useContext(CoustomContext);

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [sender, setSender] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voiceloading, setvoiceloading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [previewAudio, setPreviewAudio] = useState(null);
  const [View, setView] = useState(false);
  const [viewImg, setviewImg] = useState("");

  const [selectedImage, setSelectedImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // Refs for MediaRecorder
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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
  //For Call
  setFrom(senderId)
  setTo(receiverId)

  // Start recording voice
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setPreviewAudio(audioBlob);
        setIsRecording(false);
        console.log(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Cannot start recording:", err);
      alert("Microphone access denied or not available.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
  };

  // Send voice to backend
  const sendVoice = async (audioBlob) => {
    const formData = new FormData();
    formData.append("voice", audioBlob, "voiceMessage.webm");
    setvoiceloading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/upload/voice", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("voice data is :", data);
      if (data.url) {
        setvoiceloading(false);
        const msgObj = {
          senderId,
          receiverId,
          groupId,
          message: "",
          img: [],
          voice: data.url,
        };
        if (isGroupChat) socket.emit("sendGroupMessage", msgObj);
        else socket.emit("sendMessage", msgObj);
        setPreviewAudio(null);
      }
    } catch (err) {
      console.log("Voice upload failed", err);
    }
  };

  // Image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setSelectedImage(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  // Send text + images
  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        setLoading(false);
        return;
      }
    }

    if (!message.trim() && imgUrls.length === 0) return;

    const msgObj = { senderId, receiverId, groupId, message, img: imgUrls };

    if (isGroupChat) socket.emit("sendGroupMessage", msgObj);
    else socket.emit("sendMessage", msgObj);

    setMessage("");
    setSelectedImage([]);
    setImagePreview([]);
    setLoading(false);
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
    return () => socket.off("messagesSeen");
  }, []);

  // Receive messages
  useEffect(() => {
    const handleMessage = (data) => {
      console.log(data);
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

  const showviewImg = (e) => {
    setviewImg(e);
    setView(true);
  };

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
        <img src={videoCallIcon} alt="video call" className="chat-icon" />
        {/* thsi for audo call button */}
        <img
          src={phoneCallIcon}
          alt="audio call"
          className="chat-icon"
          onClick={()=> setshowCall(true)}
        />
      </div>

      {/* Messages */}
      <div className="chat-body">
        {View ? <Viewer images={viewImg} close={setView} /> : ""}
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
                    <img
                      key={i}
                      src={imgUrl}
                      alt="sent"
                      className="chat-img"
                      onClick={() => showviewImg(imgUrl)}
                    />
                  ))}
                </div>
              )}
              {msg.voice && (
                <audio
                  controls
                  src={msg.voice}
                  className="message-audio"
                ></audio>
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
        {/* Image input */}
        <input
          type="file"
          accept="image/*"
          id="imageUpload"
          multiple
          className="file-input"
          onChange={handleImageChange}
        />
        <label htmlFor="imageUpload" className="add-img-btn">
          📎
        </label>

        {/* Voice button */}
        <img
          src={voiceIcon}
          alt="voice"
          className={`chat-icon ${isRecording ? "recording" : ""}`}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
        />
        {isRecording && <div className="recording-indicator">Recording...</div>}

        {/* Text + send */}
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
          <button type="submit" disabled={!message} className="send-btn">
            {loading ? <span className="loader"></span> : "Send"}
          </button>
        </form>

        {/* Voice preview */}
        {previewAudio && (
          <div className="voice-preview">
            <audio controls src={URL.createObjectURL(previewAudio)}></audio>
            <button onClick={() => sendVoice(previewAudio)}>
              {voiceloading ? <div className="loader"></div> : "Send"}
            </button>
            <button onClick={() => setPreviewAudio(null)}>X</button>
          </div>
        )}

        {/* Image preview */}
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
