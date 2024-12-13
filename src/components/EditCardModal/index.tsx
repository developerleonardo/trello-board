import { FaRegTrashAlt } from "react-icons/fa";
import "./EditCardModal.css";
import { useContext, useEffect, useState } from "react";
import { TrelloBoardContext } from "../../Context";
import { CardType } from "../../types";

const EditCardModal = (): JSX.Element => {
  const { cardToEdit, editCard, setCardToEdit } = useContext(TrelloBoardContext);
  const [inputValues, setInputValues] = useState<CardType>({
    id: "",
    title: "",
    description: "",
    priority: "Low",
  })

  useEffect(() => {
    if (cardToEdit) {
      setInputValues({
        id: cardToEdit.id as string,
        title: cardToEdit.title,
        description: cardToEdit.description,
        priority: cardToEdit.priority,
      })
    }
  }, [cardToEdit])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  return (
    <>
      {!!cardToEdit && (
        <div className="overlay">
          <dialog className="edit-card" open={!!cardToEdit}>
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
                <button className="button delete-button">
                  <FaRegTrashAlt className="delete-button__icon" />
                  <span>Delete</span>
                </button>
                <div className="buttons">
                  <button className="button cancel-button">Cancel</button>
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
