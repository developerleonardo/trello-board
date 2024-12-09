import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { v4 as uuid } from "uuid";
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
//import { Card } from "./components/Card";
import { List } from "./components/List";
import { Layout } from "./components/Layout";
import { EditCardModal } from "./components/EditCardModal";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { ListType, Id, CardType } from "./types";
import "./App.css";

interface AppStateProps {
  lists: Array<ListType>;
}

function App(): JSX.Element {
  const [lists, setLists] = useState<AppStateProps["lists"]>([]);
  const [activeList, setActiveList] = useState<ListType | null>(null);

  const listsId = useMemo(() => lists.map((list) => list.id), [lists]);

  console.log(listsId);
  

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const createList = (): void => {
    const newColumn: ListType = {
      id: uuid(),
      title: `List ${lists.length + 1}`,
      cards: [],
    };
    setLists([...lists, newColumn]);
  };

  const updateTitleList = (title: string, id: Id): void => {
    setLists((lists) =>
      lists.map((list) => {
        if (list.id === id) {
          return { ...list, title };
        }
        return list;
      })
    );
  }

  const deleteList = (id: Id): void => {
    const filteredLists = lists.filter((list) => list.id !== id);
    setLists(filteredLists);
  };

  const addCards = (card: ListType): void => {
    const arrayOfCards = card.cards
    const cardToAdd: CardType = {
      id: uuid(),
      title: "Cad's title",
      description: 'This is a description preview. For more details go to edit mode',
      priority: 'Low',
    }
    arrayOfCards!.push(cardToAdd)
    setLists((lists) => lists.map((list) => {
      const copyList = { ...list };
      if (copyList.id === card.id) {
        return { ...list, cards: arrayOfCards };
      }
      return list;
    }));
  }

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

    setLists((lists) => {
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
              <List key={list.id} list={list} deleteList={deleteList} updateTitleList={updateTitleList} addCards={addCards} />
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
            {activeList && <List list={activeList} deleteList={deleteList} updateTitleList={updateTitleList} addCards={addCards} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </>
  );
}

export default App;
