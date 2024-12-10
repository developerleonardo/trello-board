import { MdEdit } from "react-icons/md";
import './Card.css'
import { CardType } from "../../types";

interface CardProps {
  card: CardType
}

const Card: React.FC<CardProps> = ({card}: CardProps) => {
  const {title, description, priority} = card;

  return (
    <div className='card'>
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
        <MdEdit className="card-icon" />
      </div>
      <p className="card-paragraph">{description}</p>
      <span className="card-priority">
        {priority}
      </span>
    </div>
  )
}

export { Card }