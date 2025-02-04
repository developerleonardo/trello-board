import { useContext, useEffect, useState } from "react";
import { TrelloBoardContext } from "../../Context";
import { BoardType } from "../../types";
import { MdEdit } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaRegTrashAlt } from "react-icons/fa";
import { ConfirmationDeleteBoard } from "../ConfirmationDeleteBoard";
import { GiConfirmed } from "react-icons/gi";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import "./BoardListItem.css";

interface Emoji {
  id: string;
  native: string;
  shortcodes?: string;
  skin?: number;
  unified: string;
}

interface BoardListItemProps {
  board: BoardType;
}

const BoardListItem: React.FC<BoardListItemProps> = ({
  board,
}: BoardListItemProps) => {
  const { title, id, emoji } = board;
  const {
    changeCurrentBoard,
    selectedBoard,
    editBoard,
    openConfirmationBoardModal,
    isSideBarOpen,
  } = useContext(TrelloBoardContext);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isActiveBoard, setIsActiveBoard] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [inputValue, setInputValue] = useState<string>(title);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState<string | null>(null);

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
    if (newTitle.length > 0 && newTitle !== title || emoji !== currentEmoji) {
      await editBoard(id, newTitle, currentEmoji || emoji);
    }
    setIsEditMode(false);
    setIsOpenMenu(false);
  };

  const handleMouseEnter = () => {
    setIsMouseOver(true);
  };
  const handleMouseLeave = () => {
    setIsMouseOver(false);
  };

  return (
    <li
      key={id}
      className={`list__item list__item--${activeStyle}`}
      onClick={() => changeCurrentBoard(id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isEditMode ? (
        <div
          className={
            isSideBarOpen ? `list__item__name` : `list__item__name--closed`
          }
        >
          <span>{emoji}</span>
          <span>{title}</span>
        </div>
      ) : (
        <div className="list__item__name">
          <button
            className="emoji-picker__button"
            onClick={() => setIsPickerVisible(!isPickerVisible)}
          >
            {currentEmoji || "🐹"}
          </button>
          {isPickerVisible && (
            <div className="emoji-picker">
              <Picker
                data={data}
                previewPosition="none"
                onEmojiSelect={(event: Emoji) => {
                  setCurrentEmoji(event.native);
                  setIsPickerVisible(!isPickerVisible);
                }}
              />
            </div>
          )}
          <input
            type="text"
            className="board-edit-input"
            value={inputValue}
            onChange={onTitleChange}
            autoFocus
            //onBlur={onEditBoard}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              if (event.key === "Enter") onEditBoard();
              setIsEditMode(false);
            }}
            maxLength={20}
          />
        </div>
      )}
      {isMouseOver && isSideBarOpen && !isEditMode && (
        <button
          className="options-menu-button"
          onClick={(event) => {
            event.stopPropagation();
            setIsOpenMenu(!isOpenMenu);
          }}
        >
          <HiOutlineDotsHorizontal className="option-icon" />
        </button>
      )}
      { isEditMode && (
        <button
          className="options-menu-button"
          onClick={(event) => {
            event.stopPropagation();
            onEditBoard();
          }}
        >
          <GiConfirmed className="option-icon confirm-icon" />
        </button>
      )}
      {isOpenMenu && (
        <>
          <div className="options-menu">
            <button
              className="board-menu__options"
              onClick={(event) => {
                event.stopPropagation();
                setIsEditMode(!isEditMode);
                setIsOpenMenu(false);
              }}
            >
              <MdEdit className="edit-icon" />
              <span>Edit</span>
            </button>
            <button
              className="board-menu__options"
              onClick={(event) => {
                event.stopPropagation();
                openConfirmationBoardModal(id);
              }}
            >
              <FaRegTrashAlt className="edit-icon delete-icon" />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}
      <ConfirmationDeleteBoard />
    </li>
  );
};

export { BoardListItem };
