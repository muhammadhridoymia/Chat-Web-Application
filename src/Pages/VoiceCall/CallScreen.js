import React, { useContext, useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import "../../Styles/CallScreen.css";
import { CoustomContext } from "../Context";
import Ring from "../../Audio/Ringtone.mp3"

export default function CallScreen() {
  const {
    callState,
    incomingCaller,
    setCallState,
    setIncomingCaller,
    to,
    from,
    setshowCall,
    peerRef,
    pendingCandidates,
    callTimer,
    startTimer,
    stopTimer,
    formatTime,
  } = useContext(CoustomContext);

  const remoteAudioRef = useRef(null);
  const ringtoneRef = useRef(null);
  


  // CREATE PEER
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

  // Start Mic
  const startMic = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    peerRef.current = createPeer();

    // add mic tracks to peer
    stream
      .getTracks()
      .forEach((track) => peerRef.current.addTrack(track, stream));
  };

  //Stop Mic
  const StopMic = () => {
    // 1. Stop sending mic
    if (peerRef.current) {
      peerRef.current.getSenders().forEach((sender) => {
        if (sender.track) sender.track.stop();
      });

      // 2. Close WebRTC connection
      peerRef.current.close();
      peerRef.current = null;
    }

    // 3. Stop remote audio playback
    if (remoteAudioRef.current?.srcObject) {
      remoteAudioRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());

      remoteAudioRef.current.srcObject = null;
    }
  };

  // Start Call
  const startCall = async () => {
    setCallState("calling");

    await startMic();

    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);

    socket.emit("call-user", {
      from,
      to,
      offer,
    });
  };

  const acceptCall = async () => {
    setCallState("in-call");

    await startMic();

    // THIS MUST COME BEFORE ICE
    await peerRef.current.setRemoteDescription(incomingCaller.offer);

    // NOW it's safe to add ICE
    pendingCandidates.current.forEach((candidate) => {
      peerRef.current.addIceCandidate(candidate);
    });
    pendingCandidates.current = [];

    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);

    socket.emit("accept-call", {
      to: incomingCaller.from,
      answer,
    });
    startTimer();
  };

  const rejectCall = () => {
    socket.emit("reject-call", {
      to: incomingCaller.from,
    });
    setCallState("idle");
    setIncomingCaller(null);
    setshowCall(false);
  };
  const cancelCall = () => {
    socket.emit("call-cancel", { to });
    StopMic();
    stopTimer();
    setCallState("idle");
    setshowCall(false);
  };


  useEffect(() => {
  if (callState === "ringing") {
    ringtoneRef.current.muted = true;
    ringtoneRef.current.play()
      .then(() => {
        ringtoneRef.current.muted = false;
      })
      .catch(err => console.log("Ringtone error:", err));
  } else {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  }
}, [callState]);


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
        <div className="close">
          <button onClick={() => setshowCall(false)}>X</button>
        </div>
        <div className="body">
          <p className="timer">Time: {formatTime(callTimer)}</p> {/* show timer */}
          <audio ref={remoteAudioRef} autoPlay />
          <audio ref={ringtoneRef} src={Ring} loop />
          {renderUI()}
        </div>
      </div>
    </div>
  );
}
