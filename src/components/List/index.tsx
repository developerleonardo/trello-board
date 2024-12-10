import { Id, ListType } from "../../types";
import { FaRegTrashAlt } from "react-icons/fa";
import { RxDragHandleDots2 } from "react-icons/rx";
import "./List.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Card } from "../Card";

interface ListProps {
  list: ListType;
  deleteList: (id: Id) => void;
  updateTitleList: (title: string, id: Id) => void;
  addCards: (card: ListType) => void;
}
const List: React.FC<ListProps> = ({list, deleteList, updateTitleList, addCards}: ListProps) => {
  const {id, title} = list;
  const [editMode, setEditMode] = useState<boolean>(false);
  
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
    id: id,
    data: {
      type: "List",
      list
    },
    disabled: editMode
  })

  if(isDragging) {
    return <div ref={setNodeRef} style={{transform: CSS.Transform.toString(transform),
      transition,}} className="list"></div>;
  }

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateTitleList(event.target.value, id);
  }

  return (
    <div 
    ref={setNodeRef}
    {...attributes}
    {...listeners}
    style={{
      transform: CSS.Transform.toString(transform),
      transition,
    }}
    className="list">
      <div className="add-list">
        <div className="add-list__actions">
          <input type="text" value={title} onChange={onTitleChange} onFocus={() => setEditMode(true)} onBlur={() => setEditMode(false)} onKeyDown={(event) => { if(event.key === "Enter") setEditMode(false)}} />
          <span className="add-list__icons">
            <FaRegTrashAlt className="add-list__icon add-list__icon--delete" onClick={() => deleteList(id)} />
            <RxDragHandleDots2 className="add-list__icon add-list__icon--drag" />
          </span>
        </div>
        <button className="add-list__button" onClick={() => addCards(list)}>Add a new card</button>
      </div>
      <div className="cards-container">
        {
          list.cards?.map((card) => (
            <Card key={card.id} card={card} />
          ))
        }
      </div>
    </div>
  );
};

export { List };
