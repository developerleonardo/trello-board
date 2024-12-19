import { IoAlertCircleOutline } from "react-icons/io5";
import './ConfirmationModal.css'
import { useContext } from "react";
import { TrelloBoardContext } from "../../Context";
import { Id } from "../../types";

interface ConfirmationModalProps {
  id: Id;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({id}: ConfirmationModalProps) => {

  const { isConfirmationModalOpen, deleteList, closeConfirmationModal } = useContext(TrelloBoardContext);

  return (
    <>
      {isConfirmationModalOpen &&
        <div className='overlay' onClick={closeConfirmationModal}>
          <dialog className='confirmation-modal'>
            <span className="confirmation-modal_alert-outer">
              <span className='confirmation-modal_alert-inner'>
                <IoAlertCircleOutline className='confirmation-modal_alert-icon' />
              </span>
            </span>
            <h2 className="confirmation-modal__title">You are about to delete a list</h2>
            <p className="confirmation-modal__paragraph">This list has at least one card. Do you want to delete it?</p>
            <div className='confirmation-modal__buttons'>
              <button className='button cancel-button' onClick={closeConfirmationModal}>Cancel</button>
              <button className='button button--delete' onClick={() => deleteList(id)}>Delete</button>
            </div>
          </dialog>
        </div>
      }

    </>
  )
}

export { ConfirmationModal }