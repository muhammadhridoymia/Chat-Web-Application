import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/Signin.css";


const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");


  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    const userData = {
      email,
      password,
    };



    setTimeout(async () => {
      const res= await fetch('http://localhost:5000/api/users/login',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(userData)
      });
      const data= await res.json();
      setMessage(data.message);
      localStorage.setItem("userSigninData", JSON.stringify(data.user));
      setLoading(false);
      form.reset();
      if(data.user){
        navigate("/")
      };
    }, 5000);

  };

  return (
    <div className="login-container">  
      <div className="login-box">
        <div className="message"> {message}</div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Log In</h2>
            <input type="email" id="email" name="email" required placeholder="Enter Your Email"/>
            <input type="password" id="password" name="password" required placeholder="Enter Your Password" />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (<div className="loading-spinner"></div>): "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
