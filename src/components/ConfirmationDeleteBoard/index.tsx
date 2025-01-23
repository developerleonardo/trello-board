import { useContext } from "react";
import { TrelloBoardContext } from "../../Context";
import { IoAlertCircleOutline } from "react-icons/io5";
import "./ConfirmationDeleteBoard.css";


const ConfirmationDeleteBoard = (): JSX.Element    => {

const {isDeleteBoardModalOpen , closeConfirmationBoardModal, deleteBoard, targetBoardId} = useContext(TrelloBoardContext)



  return (
    <>
      {isDeleteBoardModalOpen && (
        <div className="overlay" onClick={closeConfirmationBoardModal}>
          <dialog
            className="confirmation-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="confirmation-modal_alert-outer">
              <span className="confirmation-modal_alert-inner">
                <IoAlertCircleOutline className="confirmation-modal_alert-icon" />
              </span>
            </span>
            <h2 className="confirmation-modal__title">
              You are about to delete a Board
            </h2>
            <p className="confirmation-modal__paragraph">
              This action is irreversible. Do you want to delete it?
            </p>
            <div className="confirmation-modal__buttons">
              <button
                className="button cancel-button"
                onClick={closeConfirmationBoardModal}
              >
                Cancel
              </button>
              <button
                className="button button--delete"
                onClick={() => {
                  if(targetBoardId)
                  deleteBoard(targetBoardId)
                } }
              >
                Delete
              </button>
            </div>
          </dialog>
        </div>
      )}
    </>
  );
};

export { ConfirmationDeleteBoard };
