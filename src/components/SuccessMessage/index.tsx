import { useContext } from "react";
import { TrelloBoardContext } from "../../Context";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import "./SuccessMessage.css";

const SuccessMessage = (): JSX.Element => {
  const { isSuccessMessageOpen, setIsSuccessMessageOpen } = useContext(TrelloBoardContext);

  const closeSuccessMessage = () => {
    setIsSuccessMessageOpen(false);
  }

  return (
    <>
      {isSuccessMessageOpen && (
        <div className="message-container success-message">
          <div className="icon">
            <IoMdCheckmarkCircleOutline className="circle-check" />
          </div>
          <div className="message">
            <h3>Email Sent Successfully!</h3>
            <p>Check your inbox to authenticate</p>
          </div>
          <button className="close-icon__container close-icon__container--green">
            <IoIosClose className="close-icon" onClick={closeSuccessMessage} />
          </button>
        </div>
      )}
    </>
  );
};

export { SuccessMessage };
