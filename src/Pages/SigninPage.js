import React from "react";
import { useNavigate } from "react-router-dom";
import "../Pages/Styles/Signin.css";


const SigninPage = () => {
const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const handleSubmit =  async (event) => {
    event.preventDefault();
    setLoading(true);
    const form = event.target;
    const name=form.username.value;
    const email = form.email.value;
    const password = form.password.value;

    const userData = {
      name,
      email,
      password,
    };

  

    setTimeout(async () => {
      const res= await fetch('http://localhost:5000/api/users/signup',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(userData)
      });
      const data= await res.json();
      setMessage(data.message);
      // alert("Log In Successful!");
      setLoading(false);
      form.reset();
      navigate("/login");
    }, 5000);

  };

  return (
    <div className="login-container">  
      <div className="login-box">
        <div className="message"> {message}</div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
            <input type="text" id="username" name="username" required placeholder="Enter Your Username"/>
            <input type="email" id="email" name="email" required placeholder="Enter Your Email"/>
            <input type="password" id="password" name="password" required placeholder="Enter Your Password" />
            <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Confirm Your Password" />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (<div className="loading-spinner"></div>): "Sign In"}
          </button>
          <button type="button" className="signin-button" onClick={() => navigate('/login')}>
            Already have an account? Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SigninPage;
