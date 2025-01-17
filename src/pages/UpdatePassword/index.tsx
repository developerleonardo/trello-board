import { useContext, useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { supabase } from "../../supabase/client";
import { TrelloBoardContext } from "../../Context";
import { SuccessMessage } from "../../components/SuccessMessage";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../components/ErrorMessage";

const UpdatePassword = () => {
  const { setIsSuccessMessageOpen, setIsErrorMessageOpen } =
    useContext(TrelloBoardContext);

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(location.hash.slice(1)); // Parse fragment after `#`
    const accessToken = hashParams.get("access_token");

    if (!accessToken) {
      console.error("Invalid or missing token. Redirecting to login...");
      navigate("/signin");
      return;
    }

    // You can use the token here if needed or store it in Supabase's session
  }, [location.hash, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.updateUser({ password });
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
          navigate("/signin");
        }, 3000);
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
    setPassword(e.target.value);
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
            <h2 className="login-title">Update Password</h2>
            <p className="login-description">Type your new password</p>
            <label htmlFor="" className="login__label-email">
              Password
            </label>
            <input
              type="password"
              className="login__email-input"
              placeholder="********"
              onChange={handleEmailChange}
              required
              minLength={8}
            />
            <button className="login-button">Update password</button>
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

export { UpdatePassword };
