import React, { createContext, useState, useEffect } from "react";
import { socket } from "../Pages/socket";

export const CoustomContext = createContext();

export const ContextProvider = ({ children }) => {
  const [UserData, setUserData] = useState(null);
  
  const [to ,setTo]=useState("")
  const [from,setFrom]=useState("")
  const [showCall,setshowCall]=useState(false)
    const [callState, setCallState] = useState("idle"); 
  // idle | calling | ringing | in-call
  const [incomingCaller, setIncomingCaller] = useState(null);

  useEffect(() => {
    socket.on("incoming-call", ({ from }) => {
      setIncomingCaller(from);
      console.log("incoming-call : ",from)
      setCallState("ringing");
      setshowCall(true)
    });

    socket.on("call-accepted", () => {
      setCallState("in-call");
    });

    socket.on("call-rejected", () => {
      setCallState("idle");
      setIncomingCaller(null);
      alert("Call rejected");
    });

    socket.on("cancled",()=>{
      setCallState("idle")
    })

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-rejected");
    };
  }, []);

  return (
    <CoustomContext.Provider value={{ UserData,setUserData,callState,setCallState,setIncomingCaller,incomingCaller,to,setTo,from,setFrom ,showCall,setshowCall}}>
      {children}
    </CoustomContext.Provider>
  );
};
