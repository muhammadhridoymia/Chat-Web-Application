import React, { useContext } from "react";
import { socket } from "../socket";
import "../../Styles/CallScreen.css";
import { CoustomContext } from "../Context";

export default function CallScreen({ senderId, receiverId }) {
  const { callState, incomingCaller, setCallState, setIncomingCaller } =
    useContext(CoustomContext);

  // CALL BUTTON CLICK
  const startCall = () => {
    socket.emit("call-user", {
      from: senderId,
      to: receiverId,
    });
    setCallState("calling");
  };

  const acceptCall = () => {
    socket.emit("accept-call", {
      from: senderId,
      to: incomingCaller,
    });
    setCallState("in-call");
  };

  const rejectCall = () => {
    socket.emit("reject-call", {
      to: incomingCaller,
    });
    setCallState("idle");
    setIncomingCaller(null);
  };

  // ---------------- UI ----------------

  if (callState === "idle") {
    return <button onClick={startCall}>📞 Call</button>;
  }

  if (callState === "calling") {
    return (
      <div className="call-screen">
        <div className="calling-text">Calling...</div>
      </div>
    );
  }

  if (callState === "ringing") {
    return (
      <div className="call-screen">
        <p>Incoming Call</p>
        <button onClick={acceptCall}>Accept</button>
        <button onClick={rejectCall}>Reject</button>
      </div>
    );
  }

  if (callState === "in-call") {
    return <div className="call-screen">Connected</div>;
  }

  return null;
}
