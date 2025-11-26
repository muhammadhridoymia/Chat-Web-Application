import React from "react";
import "./Styles/Signin.css";


const Login = () => {
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

    // Store the data in localStorage as a JSON string
    localStorage.setItem("userSigninData", JSON.stringify(userData));

    setTimeout(() => {
      setMessage("Log In Successful!");
      // alert("Log In Successful!");
      setLoading(false);
      form.reset();
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
