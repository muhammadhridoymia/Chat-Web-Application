import React, { useEffect } from "react";
import { socket } from "./socket";
import "./Styles/CallScreen.css";

export default function CallScreen({
  status,
  onAccept,
  onReject,
  senderId,
  receiverId,
}) {
  useEffect(() => {
    const startCall = () => {
      socket.emit("call-user", {
        from: senderId,
        to: receiverId,
      });
    };
    startCall();
  });

  return (
    <div className="call-screen">
      <h2>Voice Call</h2>

      {status === "calling" && <p>Calling...</p>}
      {status === "incoming" && (
        <>
          <p>Incoming Call</p>
          <button onClick={onAccept}>Accept</button>
          <button onClick={onReject}>Reject</button>
        </>
      )}

      {status === "connected" && <p>Connected</p>}
    </div>
  );
}
