import { useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { List } from "./components/List";
import { Layout } from "./components/Layout";
import { EditCardModal } from "./components/EditCardModal";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { ListType } from "./types";
import "./App.css";
import { TrelloBoardContext } from "./Context";

function App(): JSX.Element {
  const [activeList, setActiveList] = useState<ListType | null>(null);

  const { lists, setLists, createList } = useContext(TrelloBoardContext);

  const listsId = useMemo(() => lists.map((list) => list.id), [lists]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "List") {
      setActiveList(event.active.data.current.list);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeListId = active.id;
    const overListId = over.id;

    if (activeListId === overListId) return;
    
    setLists((lists: Array<ListType>) => {
      const newList = [...lists];
      const overIndex = newList.findIndex((list) => list.id === overListId);
      const activeIndex = newList.findIndex((list) => list.id === activeListId);
      return arrayMove(newList, activeIndex, overIndex);
    });
  };

  return (
    <>
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <h1 className="title">TRELLO BOARD</h1>
          <Layout>
            <SortableContext items={listsId}>
              {lists.map((list) => (
                <List key={list.id} list={list} />
              ))}
            </SortableContext>
            <button className="add-list-button" onClick={() => createList()}>
              <span className="add-list-button__plus">+</span>
              <span className="add-list-button__text">Add List</span>
            </button>
            <EditCardModal />
            <ConfirmationModal />
          </Layout>
          {createPortal(
            <DragOverlay>
              {activeList && <List list={activeList} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
    </>
  );
}

export default App;
