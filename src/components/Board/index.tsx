import { useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { List } from "../List";
import { Layout } from "../Layout";
import { EditCardModal } from "../EditCardModal";
import { CardType, ListType } from "../../types";
import { TrelloBoardContext } from "../../Context";
import { Card } from "../Card";
import { FaPlus } from "react-icons/fa6";
import { EmptyState } from "../EmptyState";
import "./Board.css"

const Board = (): JSX.Element => {
    const [activeList, setActiveList] = useState<ListType | null>(null);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const { lists, setLists, createList, selectedBoard } = useContext(TrelloBoardContext);

  const { id, title } = selectedBoard;

  const customLists = useMemo(
    () =>
      lists
        .filter((list) => list.boardId === selectedBoard.id),
    [lists, selectedBoard.id, selectedBoard.title]
  );
  const customListsId = useMemo(() => lists.map((list) => list.id), [lists]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "List") {
      setActiveList(event.active.data.current.list);
      return;
    }
    if (event.active.data.current?.type === "Card") {
      setActiveCard(event.active.data.current.card);
      return;
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    setLists((lists: Array<ListType>) => {
      // Deep copy the lists to avoid mutating state directly
      const newList = [...lists];

      if (activeType === "Card" && overType === "Card") {
        // Find active card and its list
        const activeListIndex = newList.findIndex((list) =>
          list.cards?.some((card) => card.id === active.id)
        );
        const overListIndex = newList.findIndex((list) =>
          list.cards?.some((card) => card.id === over.id)
        );

        if (activeListIndex === -1 || overListIndex === -1) return lists;

        const activeCardIndex = newList[activeListIndex].cards!.findIndex(
          (card) => card.id === active.id
        );
        const overCardIndex = newList[overListIndex].cards!.findIndex(
          (card) => card.id === over.id
        );

        if (activeListIndex === overListIndex) {
          // Same list: reorder cards using arrayMove
          const reorderedCards = arrayMove(
            newList[activeListIndex].cards!,
            activeCardIndex,
            overCardIndex
          );
          newList[activeListIndex] = {
            ...newList[activeListIndex],
            cards: reorderedCards,
          };
        } else {
          // Different lists: remove from active and insert into over
          const [movedCard] = newList[activeListIndex].cards!.splice(
            activeCardIndex,
            1
          );
          newList[overListIndex].cards!.splice(overCardIndex, 0, movedCard);
        }
      }

      return newList;
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Reset active state
    setActiveList(null);
    setActiveCard(null);

    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    setLists((lists: Array<ListType>) => {
      const newList = [...lists];

      if (activeType === "Card" && overType === "Card") {
        const activeListIndex = newList.findIndex((list) =>
          list.cards?.some((card) => card.id === active.id)
        );

        if (activeListIndex === -1) return lists;

        const activeCardIndex = newList[activeListIndex].cards!.findIndex(
          (card) => card.id === active.id
        );
        const overCardIndex = newList[activeListIndex].cards!.findIndex(
          (card) => card.id === over.id
        );

        if (activeCardIndex === -1 || overCardIndex === -1) return lists;
        if (activeCardIndex === overCardIndex) return lists; // No movement needed

        const updatedCards = arrayMove(
          newList[activeListIndex].cards!,
          activeCardIndex,
          overCardIndex
        );

        newList[activeListIndex] = {
          ...newList[activeListIndex],
          cards: updatedCards,
        };

        return newList;
      }

      // Handle card movement between lists (already implemented)
      if (activeType === "Card" && overType === "List") {
        const activeListIndex = newList.findIndex((list) =>
          list.cards?.some((card) => card.id === active.id)
        );
        const overListIndex = newList.findIndex((list) => list.id === over.id);

        if (activeListIndex === -1 || overListIndex === -1) return lists;

        const activeCardIndex = newList[activeListIndex].cards!.findIndex(
          (card) => card.id === active.id
        );
        const [movedCard] = newList[activeListIndex].cards!.splice(
          activeCardIndex,
          1
        );

        newList[overListIndex].cards!.push(movedCard);

        return newList;
      }

      // Handle list reordering (already implemented)
      if (activeType === "List" && overType === "List") {
        const activeListIndex = newList.findIndex(
          (list) => list.id === active.id
        );
        const overListIndex = newList.findIndex((list) => list.id === over.id);

        if (activeListIndex === -1 || overListIndex === -1) return lists;

        return arrayMove(newList, activeListIndex, overListIndex);
      }

      return newList;
    });
  };
  
  if (customLists.length === 0) {
    return (
      <>
        <h1 className="title">{title}</h1>
        <Layout>
          <EmptyState selectedBoard={selectedBoard} />
        </Layout>
      </>
    );
  }
  return (
    <main className="board">
        <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <h1 className="title">{title}</h1>
        <Layout>
          <SortableContext items={customListsId}>
            {customLists.map((list) => (
              <List key={list.id} list={list} />
            ))}
          </SortableContext>
          <button className="add-list-button" onClick={() => createList(id)}>
            <span className="add-list-button__plus">
              <FaPlus />
            </span>
            <span className="add-list-button__text">Add List</span>
          </button>
          <EditCardModal />
        </Layout>
        {createPortal(
          <DragOverlay>
            {activeList && <List list={activeList} />}
            {activeCard && <Card card={activeCard} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </main>
  )
}

export { Board }