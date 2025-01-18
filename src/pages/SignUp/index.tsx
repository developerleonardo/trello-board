import { useContext, useState } from "react";
import { Layout } from "../../components/Layout";
import { supabase } from "../../supabase/client";
import { TrelloBoardContext } from "../../Context";
import { SuccessMessage } from "../../components/SuccessMessage";
import { Link } from "react-router-dom";
import { ErrorMessage } from "../../components/ErrorMessage";

const SignUp = () => {
  const {
    setIsSuccessMessageOpen,
    setIsErrorMessageOpen,
  } = useContext(TrelloBoardContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: "http://localhost:5173/",
        }
      });
      setIsSuccessMessageOpen(true);
      setTimeout(() => {
        setIsSuccessMessageOpen(false);
      }, 5000);
    } catch (error) {
      console.error("Error sending OTP", error);
      setIsErrorMessageOpen(true);
      setTimeout(() => {
        setIsErrorMessageOpen(false);
      }, 5000);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }


  return (
    <Layout>
      <div className="login-page">
        <div className="login-container">
          <header className="login-header-container">
            <img src="./favicon-100x100--white.png" alt="app-logo" />
            <h1 className="login-header">Boardy</h1>
          </header>
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">Sign Up</h2>
            <p className="login-description">
              Enter your email and password to continue
            </p>
            <label htmlFor="" className="login__label-email">
              Email
            </label>
            <input
              type="email"
              className="login__email-input"
              placeholder="example@mail.com"
              onChange={handleEmailChange}
              required
            />
              <label htmlFor="" className="login__label-email">
                Password
              </label>
            <input
              type="password"
              className="login__email-input"
              placeholder="********"
              onChange={handlePasswordChange}
              required
            />
            <button className="login-button">Sign Up</button>
            <span className="login__register">
            Already have an account? <Link to="/signin">Sign in</Link>
            </span>
          </form>
        </div>
        <div className="login-info">
          <img
            src="./onboarding-img.svg"
            alt="app-img"
            className="login-info__img"
          />
          <h2 className="login-info__title">
            Simplify your workflow and stay organized with Boardy
          </h2>
          <p className="login-info__description">
            The ultimate task and project management tool. Collaborate
            seamlessly, track progress, and achieve your goals—all in one
            intuitive platform.
          </p>
        </div>
      </div>
      <SuccessMessage />
      <ErrorMessage />
    </Layout>
  );
};

export { SignUp }