import { MdEdit } from "react-icons/md";
import './Card.css'

const Card = (): JSX.Element => {
  return (
    <div className='card'>
      <div className="card-header">
        <h2 className="card-title">Cards title</h2>
        <MdEdit className="card-icon" />
      </div>
      <p className="card-paragraph">This is a description preview. For more details go to edit mode</p>
      <span className="card-priority">
        High
      </span>
    </div>
  )
}

export { Card }