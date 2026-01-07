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
    peerRef,
    pendingCandidates,
  } = useContext(CoustomContext);

  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);

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

    // play own mic (muted to avoid echo)
    localAudioRef.current.srcObject = stream;

    peerRef.current = createPeer();

    // add mic tracks to peer
    stream
      .getTracks()
      .forEach((track) => peerRef.current.addTrack(track, stream));
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

    await startMic(); // creates peer + adds tracks

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
        <audio ref={localAudioRef} autoPlay muted />
        <audio ref={remoteAudioRef} autoPlay />
        {renderUI()}
      </div>
    </div>
  );
}
