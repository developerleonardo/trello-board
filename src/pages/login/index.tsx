import { useContext, useState } from "react";
import { Layout } from "../../components/Layout";
import { supabase } from "../../supabase/client";
import { TrelloBoardContext } from "../../Context";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
import { ErrorMessage } from "../../components/ErrorMessage";
import { MdEdit } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";
import "./login.css";

const Login = () => {
  const {
    setIsGuest,
    setKanbanBoards,
    setLists,
    setCards,
    setIsErrorMessageOpen,
  } = useContext(TrelloBoardContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error(error);
        setIsErrorMessageOpen(true);
        setTimeout(() => {
          setIsErrorMessageOpen(false);
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

  const handleGuestLogin = () => {
    setIsGuest(true);
    setKanbanBoards([
      {
        id: "1",
        title: "TRELLO BOARD",
        userId: "user1",
      },
    ]);
    setLists([
      {
        boardId: "1",
        userId: "user1",
        id: "list1", // Generate a unique ID for the new list
        title: "List 1", // Set the title of the new list
        order: 0, // Set the order of the new list
      },
    ]);
    setCards([
      {
        userId: uuid(),
        listId: "list1",
        id: uuid(), // Generate a unique ID for the new card
        title: "Card's title", // Set a default title for the new card
        description:
          "This is a description preview. To edit this card, please click on the icon in the right top", // Set a default description
        priority: "Low", // Set a default priority
        order: 0, // Set the order of the new card
      },
    ]);
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
            <div className="login__password-container">
              <label htmlFor="" className="login__label-email">
                Password
              </label>
              <Link to="/recover-password">Forgot Password?</Link>
            </div>
            <input
              type="password"
              className="login__email-input"
              placeholder="********"
              onChange={handlePasswordChange}
              required
              minLength={8}
            />
            <button className="login-button">Sign in</button>
            <span className="login__register">
              Don&#39;t have an account? <Link to="/signup">Register</Link>
            </span>
            <p className="form-or">Or</p>
            <button
              className="button secondary-button"
              onClick={handleGuestLogin}
            >
              Login as Guest
            </button>
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
                  <span className="card-priority card-priority--low">
                    Low
                  </span>
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
      <ErrorMessage />
    </Layout>
  );
};

export { Login };
