import React, { useEffect, useState } from "react";
import { Route, Routes as Routers } from "react-router-dom";
import Home from "./Pages/Home";
import SignupPage from "./Pages/SigninPage";
import LoginPage from "./Pages/LoginPage";
import AddFriends from "./Pages/AddFriends";
import CreateGroup from "./Pages/CreateGroup";
import CallScreen from "./Pages/CallScreen"; // you will create this
import { socket } from "./Pages/socket";
import "./App.css";

function App() {
  const [callStatus, setCallStatus] = useState("idle"); 
  const [callData, setCallData] = useState(null);

  useEffect(() => {
    socket.on("incoming-call", (data) => {
      setCallData(data);
      setCallStatus("incoming");
    });

    socket.on("call-ended", () => {
      setCallStatus("idle");
      setCallData(null);
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-ended");
    };
  }, []);

  return (
    <div>
      <Routers>
        <Route path="/" element={<Home setCallStatus={setCallStatus} />} />
        <Route path="/signin" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/addfriends" element={<AddFriends />} />
        <Route path="/creategroup" element={<CreateGroup />} />
      </Routers>

      {/* FULL SCREEN CALL OVERLAY */}
      {callStatus !== "idle" && (
        <CallScreen
          callStatus={callStatus}
          callData={callData}
          endCall={() => setCallStatus("idle")}
          acceptCall={() => setCallStatus("connected")}
        />
      )}
    </div>
  );
}

export default App;
