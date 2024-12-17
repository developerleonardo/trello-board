import { FaPlus } from "react-icons/fa6";
import { useContext } from "react";
import { TrelloBoardContext } from "../../Context";
import "./EmptyState.css";

const EmptyState = () => {
  const { createList } = useContext(TrelloBoardContext);

  return (
    <div className="empty-state">
      <div className="empty-state__illustration">
        <div className="illustration__content">
          <span className="illustration__content__header"></span>
          <div className="illustration__content__buttons">
            <span></span>
            <span></span>
          </div>
        </div>
        <span className="empty-state__illustration__footer"></span>
      </div>
      <div className="empty-state__illustration">
        <div className="illustration__content">
          <span className="illustration__content__header"></span>
          <div className="illustration__content__buttons">
            <span></span>
            <span></span>
          </div>
        </div>
        <span className="empty-state__illustration__footer"></span>
      </div>
      <div className="empty-state__illustration">
        <div className="illustration__content">
          <span className="illustration__content__header"></span>
          <div className="illustration__content__buttons">
            <span></span>
            <span></span>
          </div>
        </div>
        <span className="empty-state__illustration__footer"></span>
      </div>
      <h2 className="empty-state__title">Start by adding a list</h2>
      <p className="empty-state__description">
        Create your first list to organize tasks, ideas, or projects. Click the
        button below to get started and bring your board to life!
      </p>
      <button className="add-list-button add-list-button--empty-state" onClick={() => createList()}>
        <span className="add-list-button__plus">
          <FaPlus />
        </span>
        <span className="add-list-button__text">Add List</span>
      </button>
    </div>
  );
};

export { EmptyState };
