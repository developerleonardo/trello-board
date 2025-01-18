import { useContext } from "react";
import { TrelloBoardContext } from "../../Context";
import { MdErrorOutline } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import "./ErrorMessage.css";

const ErrorMessage = (): JSX.Element => {
  const { isErrorMessageOpen, setIsErrorMessageOpen } = useContext(TrelloBoardContext);

  const closeSuccessMessage = () => {
    setIsErrorMessageOpen(false);
  }

  return (
    <>
      {isErrorMessageOpen && (
        <div className="message-container error-message">
          <div className="icon">
            <MdErrorOutline className="error-icon" />
          </div>
          <div className="message">
            <h3>Something went wrong!</h3>
            <p>Please try again</p>
          </div>
          <button className="close-icon__container close-icon__container--red">
            <IoIosClose className="close-icon--red" onClick={closeSuccessMessage} />
          </button>
        </div>
      )}
    </>
  );
};

export { ErrorMessage };
