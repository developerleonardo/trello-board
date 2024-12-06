import { ListType } from "../../types";
import { FaRegTrashAlt } from "react-icons/fa";
import { RxDragHandleDots2 } from "react-icons/rx";
import "./List.css";
interface ListProps {
  children?: React.ReactNode;
  title: ListType['title']
  id: ListType['id']
  deleteList: (id: ListType['id']) => void;
}
const List = ({ children, id, title, deleteList }: ListProps) => {
  return (
    <div className="list">
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
