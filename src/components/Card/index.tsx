import { MdEdit } from "react-icons/md";
import "./Card.css";
import { CardType, Priority } from "../../types";
import { useContext, useState } from "react";
import { TrelloBoardContext } from "../../Context";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CardProps {
  card: CardType;
}

const Card: React.FC<CardProps> = ({ card }: CardProps) => {
  const { title, description, priority } = card;
  const { sendCardToEdit } = useContext(TrelloBoardContext);

  const [isMouseOver, setIsMouseOver] = useState(false);

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
    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        className="card--empty"
      />
    );
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
  const customTitle = title.length > 18 ? title.slice(0, 18) + "..." : title;

  const customDescription =
    description.length > 91 ? description.slice(0, 91) + "..." : description;

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
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      <div className="card-header">
        <h2 className="card-title">{customTitle}</h2>
        {isMouseOver && 
          <button
            className="card-edit-button"
            onClick={() => sendCardToEdit(card)}
          >
            <MdEdit className="card-icon" />
          </button>
        }
      </div>
      <p className="card-paragraph">{customDescription}</p>
      <span className={`card-priority ${badgeStyle(priority)}`}>
        {priority}
      </span>
    </div>
  );
};

export { Card };
