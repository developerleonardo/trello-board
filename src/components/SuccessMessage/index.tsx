import { useContext } from "react";
import { TrelloBoardContext } from "../../Context";
import { CiCircleCheck } from "react-icons/ci";
import "./SuccessMessage.css";

const SuccessMessage = (): JSX.Element => {
  const { isSuccessMessageOpen } = useContext(TrelloBoardContext);

  return (
    <>
      {isSuccessMessageOpen && (
        <div className="success-message">
          <div className="icon">
            <CiCircleCheck className="circle-check" />
          </div>
          <div className="message">
            <h3>Email Sent Successfully!</h3>
            <p>Check your inbox to authenticate</p>
          </div>
        </div>
      )}
    </>
  );
};

export { SuccessMessage };
