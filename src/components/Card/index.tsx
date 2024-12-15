import { MdEdit } from "react-icons/md";
import "./Card.css";
import { CardType, Priority } from "../../types";
import { useContext } from "react";
import { TrelloBoardContext } from "../../Context";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CardProps {
  card: CardType;
}

const Card: React.FC<CardProps> = ({ card }: CardProps) => {
  const { title, description, priority } = card;
  const { sendCardToEdit } = useContext(TrelloBoardContext);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
  });

  if (isDragging) {
    return <div 
    ref={setNodeRef} 
    style={{
      transform: CSS.Transform.toString(transform),
      transition,
    }}
    className="card--empty"
    />
  }

  const badgeStyle = (priority: Priority): string => {
    switch (priority) {
      case "Low":
        return "card-priority--low";
      case "Medium":
        return "card-priority--medium";
      case "High":
        return "card-priority--high";
      default:
        return "";
    }
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="card"
    >
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
        <MdEdit className="card-icon" onClick={() => sendCardToEdit(card)} />
      </div>
      <p className="card-paragraph">{description}</p>
      <span className={`card-priority ${badgeStyle(priority)}`}>
        {priority}
      </span>
    </div>
  );
};

export { Card };
