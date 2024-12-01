import './AddListButton.css'

const AddListButton = () => {
  return (
    <button className="add-list-button">
      <span className="add-list-button__plus">+</span>
      <span className="add-list-button__text">Add List</span>
    </button>
  )
}

export { AddListButton }