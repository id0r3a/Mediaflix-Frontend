import { useState } from "react";
import bgImage from "../assets/bild.png";
import LoginForm from "../forms/LoginForm";
import RegisterForm from "../forms/RegisterForm";
import "../App.css";

function Welcome() {
  const [activeForm, setActiveForm] = useState(null);

  return (
    <div
      className="welcome-container"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="overlay">
        <h1>Track your books and movies</h1>

        <div className="email-form">
          <input type="email" placeholder="Enter your email..." />
          <button>Get Started</button>
        </div>

        <div className="links">
          <button onClick={() => setActiveForm("login")}>Login</button>
          <button onClick={() => setActiveForm("register")}>Register</button>
        </div>

        {activeForm && (
          <div className="form-popup">
            <button className="close-btn" onClick={() => setActiveForm(null)}>✖</button>
            {activeForm === "login" && <LoginForm />}
            {activeForm === "register" && <RegisterForm />}
          </div>
        )}
      </div>
    </div>
  );
}


export default Welcome;
