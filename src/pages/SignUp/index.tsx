import { useContext, useState } from "react";
import { Layout } from "../../components/Layout";
import { supabase } from "../../supabase/client";
import { TrelloBoardContext } from "../../Context";
import { SuccessMessage } from "../../components/SuccessMessage";
import { Link } from "react-router-dom";
import { ErrorMessage } from "../../components/ErrorMessage";
import { MdEdit } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";

const SignUp = () => {
  const { setIsSuccessMessageOpen, setIsErrorMessageOpen } =
    useContext(TrelloBoardContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:5173/",
        },
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
              minLength={8}
            />
            <button className="login-button">Sign Up</button>
            <span className="login__register">
              Already have an account? <Link to="/signin">Sign in</Link>
            </span>
          </form>
        </div>
        <div className="login-info">
          <div className="login-info__image-container">
            <div className="list__illustration list__illustration--first">
              <div className="add-list">
                <div className="add-list__actions">
                  <p>In Progress</p>
                  <span className="list__icons">
                    <FaRegTrashAlt />
                    <RxDragHandleDots2 />
                  </span>
                </div>
                <div className="add-list__illustration">
                  <MdAddBox />
                  Add a new card
                </div>
              </div>
              <div className="card__container">
                <div className="card--illustration">
                  <div className="card-header">
                    <h2 className="card-title">UI Design</h2>
                    <div className="card__edit__illustration">
                      <MdEdit className="card-icon" />
                    </div>
                  </div>
                  <p className="card-paragraph">
                    Working on wireframes and mockups for the updated interface
                    design
                  </p>
                  <span className="card-priority card-priority--high">
                    High
                  </span>
                </div>
              </div>
            </div>
            <div className="list__illustration list__illustration--second">
              <div className="add-list">
                <div className="add-list__actions add-list__actions--backlog">
                  <p>Backlog</p>
                  <span className="add-list__icons">
                    <div className="add-list__button--delete">
                      <FaRegTrashAlt className="add-list__icon add-list__icon--delete" />
                    </div>
                    <RxDragHandleDots2 className="add-list__icon add-list__icon--drag" />
                  </span>
                </div>
                <div className="add-list__illustration add-list__illustration--backlog">
                  <MdAddBox id="add-list__illustration__icon--backlog" />
                  Add a new card
                </div>
              </div>
              <div className="card__container">
                <div className="card--illustration card__illustration--backlog">
                  <div className="card-header">
                    <h2 className="card-title">New Feature</h2>
                    <div className="card__edit__illustration">
                      <MdEdit className="card-icon" />
                    </div>
                  </div>
                  <p className="card-paragraph">
                    Working on wireframes and mockups for the updated interface
                    design
                  </p>
                  <span className="card-priority card-priority--low">Low</span>
                </div>
              </div>
            </div>
          </div>
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

export { SignUp };
