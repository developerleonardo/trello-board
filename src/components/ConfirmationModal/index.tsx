import { IoAlertCircleOutline } from "react-icons/io5";
import './ConfirmationModal.css'

const ConfirmationModal = () => {

  const openConfirmationModal = false;

  return (
    <>
      {openConfirmationModal &&
        <div className='overlay'>
          <dialog className='confirmation-modal'>
            <span className="confirmation-modal_alert-outer">
              <span className='confirmation-modal_alert-inner'>
                <IoAlertCircleOutline className='confirmation-modal_alert-icon' />
              </span>
            </span>
            <h2 className="confirmation-modal__title">You are about to delete a list</h2>
            <p className="confirmation-modal__paragraph">This list has at least one card. Do you want to delete it?</p>
            <div className='confirmation-modal__buttons'>
              <button className='button cancel-button'>Cancel</button>
              <button className='button button--delete'>Delete</button>
            </div>
          </dialog>
        </div>
      }

    </>
  )
}

export { ConfirmationModal }