import { useContext, useEffect, useState } from "react";
import { TrelloBoardContext } from "../Context";
import { BoardType } from "../types";
import { MdEdit } from "react-icons/md";
import "./BoardListItem.css";

interface BoardListItemProps {
  board: BoardType;
}

const BoardListItem: React.FC<BoardListItemProps> = ({
  board,
}: BoardListItemProps) => {
  const { title, id } = board;
  const { changeCurrentBoard, selectedBoard, editBoard } =
    useContext(TrelloBoardContext);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isActiveBoard, setIsActiveBoard] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [inputValue, setInputValue] = useState<string>(title);

  useEffect(() => {
    if (selectedBoard.id === id) {
      setIsActiveBoard(true);
    } else {
      setIsActiveBoard(false);
    }
  }, [selectedBoard, id]);

  const activeStyle = isActiveBoard ? "active" : "";

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onEditBoard = async () => {
    const newTitle = inputValue.trim(); // Trim any excess whitespace
    if (newTitle.length > 0 && newTitle !== title) {
      await editBoard(id, newTitle);
    }
    setIsEditMode(false);
  };

  return (
    <li
      key={id}
      className={`list__item list__item--${activeStyle}`}
      onClick={() => changeCurrentBoard(id)}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      {!isEditMode ? (
        <div className="list__item__name">
          <span>🐹</span>
          <span>{title}</span>
        </div>
      ) : (
        <div className="list__item__name">
          <span>🐹</span>
          <input
            type="text"
            className="board-edit-input"
            value={inputValue}
            onChange={onTitleChange}
            autoFocus
            onBlur={onEditBoard}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              if (event.key === "Enter") onEditBoard();
              setIsEditMode(false);
            }}
            maxLength={20}
          />
        </div>
      )}
      {isMouseOver && (
        <button
          className="board-edit-button"
          onClick={(event) => {
            event.stopPropagation();
            setIsEditMode(!isEditMode);
          }}
        >
          <MdEdit className="edit-icon" />
        </button>
      )}
    </li>
  );
};

export { BoardListItem };
