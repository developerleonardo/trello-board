import { ListType } from "../../types";
import { FaRegTrashAlt } from "react-icons/fa";
import { RxDragHandleDots2 } from "react-icons/rx";
import "./List.css";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useContext, useMemo, useState } from "react";
import { Card } from "../Card";
import { TrelloBoardContext } from "../../Context";
import { ConfirmationModal } from "../ConfirmationModal";

interface ListProps {
  list: ListType;
}
const List: React.FC<ListProps> = ({ list }: ListProps) => {
  const { id, title } = list;
  const { updateTitleList, addCards, checkDeleteListValidity } =
    useContext(TrelloBoardContext);
  const [editMode, setEditMode] = useState<boolean>(false);

  const tasksIds = useMemo(() => list.cards!.map((card) => card.id), [list.cards]);

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
    updateTitleList(event.target.value, id);
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
              value={title}
              onChange={onTitleChange}
              onFocus={() => setEditMode(true)}
              onBlur={() => setEditMode(false)}
              onKeyDown={(event) => {
                if (event.key === "Enter") setEditMode(false);
              }}
            />
            <span className="add-list__icons">
              <FaRegTrashAlt
                className="add-list__icon add-list__icon--delete"
                onClick={() => checkDeleteListValidity(id)}
              />
              <RxDragHandleDots2 className="add-list__icon add-list__icon--drag" />
            </span>
          </div>
          <button className="add-list__button" onClick={() => addCards(list)}>
            Add a new card
          </button>
        </div>
        <div className="cards-container">
          <SortableContext items={tasksIds}>
            {list.cards?.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </SortableContext>
        </div>
      </div>
      <ConfirmationModal id={id} />
    </>
  );
};

export { List };
