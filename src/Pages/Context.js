import React, { createContext, useState, useEffect } from "react";
import { socket } from "../Pages/socket";

export const CoustomContext = createContext();

export const ContextProvider = ({ children }) => {
  const [UserData, setUserData] = useState(null);
  
    const [callState, setCallState] = useState("idle"); 
  // idle | calling | ringing | in-call
  const [incomingCaller, setIncomingCaller] = useState(null);

  useEffect(() => {
    socket.on("incoming-call", ({ from }) => {
      setIncomingCaller(from);
      setCallState("ringing");
    });

    socket.on("call-accepted", () => {
      setCallState("in-call");
    });

    socket.on("call-rejected", () => {
      setCallState("idle");
      setIncomingCaller(null);
      alert("Call rejected");
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-rejected");
    };
  }, []); // ✅ IMPORTANT

  return (
    <CoustomContext.Provider value={{ UserData, setUserData,callState,setCallState,setIncomingCaller,incomingCaller }}>
      {children}
    </CoustomContext.Provider>
  );
};
