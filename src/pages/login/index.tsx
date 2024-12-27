import { useState } from "react";
import { Layout } from "../../components/Layout";
import "./login.css";
import { supabase } from "../../supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.auth.signInWithOtp({
        email,
      });
    } catch (error) {
      console.error("Error sending OTP", error);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <Layout>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <img
            src="./favicon-100x100--white.png"
            alt=""
            className="login-img"
          />
          <h1 className="login-title">Sign in</h1>
          <label htmlFor="" className="login__label-email">
            Enter your email to receive your authentication link
          </label>
          <input
            type="email"
            className="login__email-input"
            placeholder="Enter your email"
            onChange={handleEmailChange}
          />
          <button className="login-button">Send</button>
        </form>
      </div>
    </Layout>
  );
};

export { Login };
