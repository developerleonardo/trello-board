import { Id, ListType } from "../../types";
import { FaRegTrashAlt } from "react-icons/fa";
import { RxDragHandleDots2 } from "react-icons/rx";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useContext, useMemo, useState } from "react";
import { Card } from "../Card";
import { TrelloBoardContext } from "../../Context";
import { ConfirmationModal } from "../ConfirmationModal";
import { MdAddBox } from "react-icons/md";
import "./List.css";

interface ListProps {
  list: ListType;
}
const List: React.FC<ListProps> = ({ list }: ListProps) => {
  const { id, title } = list;
  const {
    updateTitleList,
    addCards,
    deleteList,
    openConfirmationModal,
    cards,
  } = useContext(TrelloBoardContext);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(title);

  const tasksIds = useMemo(() => cards.map((card) => card.id), [cards]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "List",
      list,
    },
    disabled: editMode,
  });

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className="list"
      ></div>
    );
  }

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onBlurChange = async (event: React.FocusEvent<HTMLInputElement>) => {
    const newTitle = event.target.value.trim(); // Trim any excess whitespace
    if (newTitle && newTitle !== title) {
      await updateTitleList(newTitle, id); // Update title only if it's valid and changed
    }
    setEditMode(false);
  };

  // Confirm delete list
  const checkDeleteListValidity = (id: Id): void => {
    const isACardInList = cards.some((card) => card.listId === id);
    if (isACardInList) {
      openConfirmationModal(id);
    } else {
      deleteList(id);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        className="list"
      >
        <div className="add-list">
          <div className="add-list__actions">
            <input
              type="text"
              value={inputValue}
              maxLength={50}
              onChange={onTitleChange}
              onFocus={() => setEditMode(true)}
              onBlur={onBlurChange}
              onKeyDown={(event) => {
                if (event.key === "Enter") setEditMode(false);
              }}
            />
            <span className="add-list__icons">
              <button className="add-list__button--delete">
                <FaRegTrashAlt
                  className="add-list__icon add-list__icon--delete"
                  onClick={() => {
                    checkDeleteListValidity(id);
                  }}
                />
              </button>
              <RxDragHandleDots2 className="add-list__icon add-list__icon--drag" />
            </span>
          </div>
          <button className="add-list__button" onClick={() => addCards(id)}>
            <MdAddBox />
            Add a new card
          </button>
        </div>
        <div className="cards-container">
          <SortableContext items={tasksIds}>
            {cards?.map((card) => {
              if (card.listId === id) return <Card key={card.id} card={card} />;
            })}
          </SortableContext>
        </div>
      </div>
      <ConfirmationModal />
    </>
  );
};

export { List };
