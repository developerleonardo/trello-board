import { useContext, useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { TrelloBoardContext } from "../../Context";
import { CardType } from "../../types";
import "./EditCardModal.css";

// Cambiar el estado a false al darle click al boton de editar o al boton de eliminar
// Modificar el closeModal para que se ejecute adecuadamente

const EditCardModal = (): JSX.Element => {
  const { cardToEdit, editCard, setCardToEdit, deleteCard, isCardEdited, setIsCardEdited } = useContext(TrelloBoardContext);
  const defaultOrder = 0;
  const defaultUserId = '';
  const [inputValues, setInputValues] = useState<CardType>({
    listId: "",
    id: "",
    title: "",
    description: "",
    priority: "Low",
    order: defaultOrder,
    userId: defaultUserId,
  })

  useEffect(() => {
    if (cardToEdit) {
      setInputValues({
        listId: cardToEdit.listId as string,
        id: cardToEdit.id as string,
        title: cardToEdit.title,
        description: cardToEdit.description,
        priority: cardToEdit.priority,
        order: cardToEdit.order,
        userId: cardToEdit.userId,
      })
    }
  }, [cardToEdit])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setIsCardEdited(true)
    setInputValues({
      ...inputValues,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    editCard(inputValues)
    setCardToEdit(null)
  }

  const closeDialog = () => {
    setCardToEdit(null)
  }

  const customCloseDialog = () => {
    if(!isCardEdited) {
      closeDialog()
    }
    return
  }

  return (
    <>
      {!!cardToEdit && (
        <div className="overlay" onClick={customCloseDialog}>
          <dialog className="edit-card" open={!!cardToEdit} onClick={(event) => event.stopPropagation()}>
          <IoIosClose className="edit-card__close-mark" onClick={closeDialog} />
            <form method="dialog" className="edit-card__form" onSubmit={handleSubmit}>
              <h2 className="edit-card__form-title">Edit Card</h2>
              <label htmlFor="title" className="title-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="input title-input"
                placeholder="Update the card's title"
                value={inputValues.title}
                onChange={handleChange}
                required
              />
              <label htmlFor="description" className="description-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="description-input"
                placeholder="Add a new description for the card"
                value={inputValues.description}
                onChange={handleChange}
              />
              <label htmlFor="priority" className="priority-label">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="input priority-input"
                value={inputValues.priority}
                onChange={handleChange}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <div className="edit-card__form-buttons">
                <button type="button" className="button delete-button" onClick={() => deleteCard(cardToEdit.id)}>
                  <FaRegTrashAlt className="delete-button__icon" />
                  <span>Delete</span>
                </button>
                <div className="buttons">
                  <button type="button" className="button cancel-button" onClick={closeDialog}>Cancel</button>
                  <button type="submit" className="button save-button">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </dialog>
        </div>
      )}
    </>
  );
};

export { EditCardModal };
