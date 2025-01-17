import { useContext, useState } from "react";
import { Layout } from "../../components/Layout";
import { supabase } from "../../supabase/client";
import { TrelloBoardContext } from "../../Context";
import { SuccessMessage } from "../../components/SuccessMessage";
import { Link } from "react-router-dom";
import { ErrorMessage } from "../../components/ErrorMessage";

const ResetPassword = () => {
  const { setIsSuccessMessageOpen, setIsErrorMessageOpen } =
    useContext(TrelloBoardContext);

  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          "https://trello-board-gamma.vercel.app/account/update-password",
      });

      if (error) {
        console.error(error);
        setIsErrorMessageOpen(true);
        setTimeout(() => {
          setIsErrorMessageOpen(false);
        }, 5000);
      } else {
        setIsSuccessMessageOpen(true);
        setTimeout(() => {
          setIsSuccessMessageOpen(false);
        }, 5000);
      }
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

  return (
    <Layout>
      <div className="login-page">
        <div className="login-container">
          <header className="login-header-container">
            <img src="./favicon-100x100--white.png" alt="app-logo" />
            <h1 className="login-header">Boardy</h1>
          </header>
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">Trouble loggin in?</h2>
            <p className="login-description">
              Type in your email and we&#39;ll send you a link to reset your
              password
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
            <button className="login-button">Send email</button>
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

export { ResetPassword };
