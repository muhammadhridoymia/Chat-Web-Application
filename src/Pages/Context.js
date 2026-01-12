import React, { createContext, useState, useEffect, useRef } from "react";
import { socket } from "../Pages/socket";

export const CoustomContext = createContext();

export const ContextProvider = ({ children }) => {
  const [UserData, setUserData] = useState(null);

  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [showCall, setshowCall] = useState(false);
  const [callState, setCallState] = useState("idle");
  // idle | calling | ringing | in-call
  const [incomingCaller, setIncomingCaller] = useState(null);
  const peerRef = useRef(null);
  const pendingCandidates = useRef([]);

  const [callTimer, setCallTimer] = useState(0); // time in seconds
  const timerRef = useRef(null);

  useEffect(() => {
    socket.on("incoming-call", ({ from, offer }) => {
      setIncomingCaller({ from, offer });
      console.log("incoming-call : ", from);
      setCallState("ringing");
      setshowCall(true);
    });

    socket.on("call-accepted", async ({ answer }) => {
      try {
        await peerRef.current.setRemoteDescription(answer);

        // flush any queued ICE candidates that arrived before the remote description
        if (pendingCandidates.current.length > 0) {
          for (const c of pendingCandidates.current) {
            try {
              await peerRef.current.addIceCandidate(new RTCIceCandidate(c));
            } catch (err) {
              console.warn("addIceCandidate failed (post-answer):", err);
            }
          }
          pendingCandidates.current = [];
        }

        setCallState("in-call");
        startTimer();
      } catch (err) {
        console.error(
          "Error setting remote description on call-accepted:",
          err
        );
      }
    });

    socket.on("ice-candidate", ({ candidate }) => {
      if (!candidate || !candidate.candidate) return;

      // try to add immediately; if it fails or remoteDescription isn't ready, queue it
      (async () => {
        try {
          if (
            peerRef.current &&
            peerRef.current.remoteDescription &&
            peerRef.current.remoteDescription.type
          ) {
            await peerRef.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          } else {
            pendingCandidates.current.push(candidate);
          }
        } catch (err) {
          console.warn("Failed to add ICE candidate, queuing:", err);
          pendingCandidates.current.push(candidate);
        }
      })();
    });

    socket.on("call-rejected", () => {
      setCallState("idle");
      setIncomingCaller(null);
      alert("Call rejected");
    });

    socket.on("canceled", () => {
      setCallState("idle");
      stopTimer();
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-rejected");
    };
  }, []);

  //Timer
  const startTimer = () => {
    setCallTimer(0); // reset
    timerRef.current = setInterval(() => {
      setCallTimer((prev) => prev + 1); // increase every second
    }, 1000);
  };
  //count Time
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };
  //Stop Timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <CoustomContext.Provider
      value={{
        UserData,
        setUserData,
        callState,
        setCallState,
        setIncomingCaller,
        incomingCaller,
        to,
        setTo,
        from,
        setFrom,
        showCall,
        setshowCall,
        peerRef,
        pendingCandidates,
        callTimer,
        startTimer,
        stopTimer,
        formatTime,
      }}
    >
      {children}
    </CoustomContext.Provider>
  );
};
