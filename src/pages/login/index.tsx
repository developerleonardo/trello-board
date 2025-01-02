import { useContext, useState } from "react";
import { Layout } from "../../components/Layout";
import "./login.css";
import { supabase } from "../../supabase/client";
import { TrelloBoardContext } from "../../Context";
import { SuccessMessage } from "../../components/SuccessMessage";

const Login = () => {

  const {setIsSuccessMessageOpen} = useContext(TrelloBoardContext);

  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.auth.signInWithOtp({
        email,
      });
      setIsSuccessMessageOpen(true);
      setTimeout(() => {
        setIsSuccessMessageOpen(false);
      }, 5000);
    } catch (error) {
      console.error("Error sending OTP", error);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <Layout>
      <div className="login-page">
        <div className="login-container">
          <header className="login-header-container">
            <img src="./favicon-100x100--white.png" alt="app-logo" />
            <h1 className="login-header">Boardy</h1>
          </header>
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">Sign in</h2>
            <label htmlFor="" className="login__label-email">
              Enter your email to receive your authentication link
            </label>
            <input
              type="email"
              className="login__email-input"
              placeholder="Enter your email"
              onChange={handleEmailChange}
              required
            />
            <button className="login-button">Send</button>
            <p className="form-or">Or</p>
            <button className="button secondary-button">Login as Guest</button>
          </form>
        </div>
        <div className="login-info">
          <img src="./trello-board.jpg" alt="app-img" className="login-info__img" />
          <h2 className="login-info__title">Simplify your workflow and stay organized with Boardy</h2>
          <p className="login-info__description">
            The ultimate task and project management tool. Collaborate
            seamlessly, track progress, and achieve your goals—all in one
            intuitive platform.
          </p>
        </div>
      </div>
      <SuccessMessage />
    </Layout>
  );
};

export { Login };
