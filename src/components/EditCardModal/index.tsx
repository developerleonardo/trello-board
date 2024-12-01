import { FaRegTrashAlt } from "react-icons/fa";
import './EditCardModal.css'

const EditCardModal = () => {
  const showModal = false;
  return (
    <>
    {
      showModal &&
      <div className='overlay'>
      <dialog className='edit-card'>
        <form className='edit-card__form'>
          <h2 className='edit-card__form-title'>Edit Card</h2>
          <label htmlFor="title" className='title-label'>Title</label>
          <input type="text" id="title" name="title" className='input title-input' placeholder="Update the card's title" />
          <label htmlFor="description" className='description-label'>Description</label>
          <textarea id="description" name="description" className='description-input' placeholder="Add a new description for the card" />
          <label htmlFor="priority" className='priority-label'>Priority</label>
          <select id="priority" className='input priority-input'>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <div className="edit-card__form-buttons">
            <button className='button delete-button'>
              <FaRegTrashAlt className='delete-button__icon' />
              <span>Delete</span>
            </button>
            <div className='buttons'>
              <button className='button cancel-button'>Cancel</button>
              <button type="submit" className='button save-button'>Save</button>
            </div>
          </div>
        </form>
      </dialog>
    </div>
    }
    </>
    
  )
}

export  { EditCardModal }