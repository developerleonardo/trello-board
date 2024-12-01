import { FaRegTrashAlt } from "react-icons/fa";
import { RxDragHandleDots2 } from "react-icons/rx";
import './AddCardButton.css'

const AddCardButton = () => {
  return (
    <div className='add-list'>
      <div className='add-list__actions'>
        <input type="text" value="Title of this list" />
        <span className='add-list__icons'>
          <FaRegTrashAlt className='add-list__icon add-list__icon--delete' />
          <RxDragHandleDots2 className='add-list__icon add-list__icon--drag' />
        </span>
      </div>
      <button className='add-list__button'>Add a new card</button>
    </div>
  )
}

export { AddCardButton }