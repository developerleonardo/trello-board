import { Id, ListType } from "../../types";
import { FaRegTrashAlt } from "react-icons/fa";
import { RxDragHandleDots2 } from "react-icons/rx";
import "./List.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ListProps {
  list: ListType;
  deleteList: (id: Id) => void;
  children?: React.ReactNode;
}
const List: React.FC<ListProps> = ({list,deleteList, children}: ListProps) => {
  const {id, title} = list;

  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
    id: id,
    data: {
      type: "List",
      list
    }
  })

  if(isDragging) {
    return <div ref={setNodeRef} style={{transform: CSS.Transform.toString(transform),
      transition,}} className="list"></div>;
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
          <input type="text" value={title} />
          <span className="add-list__icons">
            <FaRegTrashAlt className="add-list__icon add-list__icon--delete" onClick={() => deleteList(id)} />
            <RxDragHandleDots2 className="add-list__icon add-list__icon--drag" />
          </span>
        </div>
        <button className="add-list__button">Add a new card</button>
      </div>
      <div className="cards-container">
        {children}
      </div>
    </div>
  );
};

export { List };
