import React, { useContext, useRef, useEffect } from "react";
import { socket } from "../socket";
import "../../Styles/CallScreen.css";
import { CoustomContext } from "../Context";

export default function CallScreen() {
  const {
    callState,
    incomingCaller,
    setCallState,
    setIncomingCaller,
    to,
    from,
    setshowCall,
  } = useContext(CoustomContext);

  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerRef = useRef(null);

  // ---------- CREATE PEER ----------
  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Receive remote audio
    peer.ontrack = (event) => {
      remoteAudioRef.current.srcObject = event.streams[0];
    };

    // Send ICE candidates
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to,
          candidate: event.candidate,
        });
      }
    };

    return peer;
  };

  //Start Mic
  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true,});

      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Microphone permission denied");
    }
  };
  //Stop Mic
  const stopMic = () => {
    if (localAudioRef.current?.srcObject) {
      localAudioRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      localAudioRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (callState === "in-call") {
      startMic();
    } else {
      stopMic();
    }
  }, [callState]);

  const startCall = () => {
    socket.emit("call-user", {
      from,
      to,
    });
    setCallState("calling");
  };

  const acceptCall = () => {
    socket.emit("accept-call", {
      from,
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
    setshowCall(false);
  };
  const cancelCall = () => {
    socket.emit("call-cancel", { to });
    setCallState("idle");
    setshowCall(false);
  };

  //UI
  const renderUI = () => {
    switch (callState) {
      case "idle":
        return (
          <button className="call-btn" onClick={startCall}>
            📞 Call
          </button>
        );

      case "calling":
        return (
          <div>
            <div className="calling-text">Calling...</div>
            <button className="cancle-btn" onClick={cancelCall}>
              📞
            </button>
          </div>
        );

      case "ringing":
        return (
          <div className="call-screen">
            <p>Incoming Call</p>
            <button onClick={acceptCall}>Accept</button>
            <button onClick={rejectCall}>Reject</button>
          </div>
        );

      case "in-call":
        return (
          <div>
            <p>Connected</p>
            <button className="cancle-btn" onClick={cancelCall}>
              📞
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="call-con">
      <div className="call-box">
        <audio ref={localAudioRef} autoPlay />
        {renderUI()}
      </div>
    </div>
  );
}
