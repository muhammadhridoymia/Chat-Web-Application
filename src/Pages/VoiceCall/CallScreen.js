import React, { useContext,useRef,useEffect } from "react";
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
    setshowCall
  } = useContext(CoustomContext);

  const localAudioRef = useRef(null);
  const startMic = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    if (localAudioRef.current) {
      localAudioRef.current.srcObject = stream;
    }

  } catch (err) {
    alert("Microphone permission denied");
  }
};

useEffect(() => {
  if (callState === "in-call") {
    startMic();
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
    setshowCall(false)
    
  };
  const Cancle=()=>{
    socket.emit("call-cancle",{to})
    setCallState("idle")
  }

  //UI
  const renderUI = () => {
    switch (callState) {
      case "idle":
        return <button className="call-btn" onClick={startCall}>📞 Call</button>;

      case "calling":
        return (
          <div>
            <div className="calling-text">Calling...</div>
            <button className="cancle-btn" onClick={Cancle}></button>
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
          <button className="cancle-btn" onClick={Cancle}> </button>
        </div>)

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
