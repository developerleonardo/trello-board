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
import { supabase } from "../../supabase/client";
import "./Board.css";

const Board = (): JSX.Element => {
  const [activeList, setActiveList] = useState<ListType | null>(null);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const { lists, setLists, createList, selectedBoard, setCards } =
    useContext(TrelloBoardContext);

  const { id, title } = selectedBoard;

  const customLists = useMemo(
    () => lists.filter((list) => list.boardId === selectedBoard.id),
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

  const updateCardOrderInSupabase = async (cards: Array<CardType>) => {
    try {
      const { data, error } = await supabase.from("cards").upsert(cards);
      if (error) {
        console.error("Error updating card order in Supabase:", error);
      } else {
        console.log("Card order updated successfully:", data);
      }
    } catch (err) {
      console.error("Unexpected error while updating card order:", err);
    }
  };

  const updateListOrderInSupabase = async (lists: Array<ListType>) => {
    try {
      const { data, error } = await supabase.from("lists").upsert(lists);
      if (error) {
        console.error("Error updating list order in Supabase:", error);
      } else {
        console.log("List order updated successfully:", data);
      }
    } catch (err) {
      console.error("Unexpected error while updating list order:", err);
    }
  };
  
  

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

    const activeId = active.id;
    const overId = over.id;

    const isActiveACard = active.data.current?.type === "Card";
    const isOverACard = over.data.current?.type === "Card";

    if (!isActiveACard) return;

    // Drop a card over another card
    if (isActiveACard && isOverACard) {
      setCards((cards: Array<CardType>) => {
        const newCards = [...cards];
        const activeCardIndex = newCards.findIndex(
          (card) => card.id === activeId
        );
        const overCardIndex = newCards.findIndex((card) => card.id === overId);

        if (activeCardIndex === -1 || overCardIndex === -1) return cards;
        if (activeCardIndex === overCardIndex) return cards; // No movement needed

        cards[activeCardIndex].listId = cards[overCardIndex].listId;

        const updatedCards = arrayMove(
          newCards,
          activeCardIndex,
          overCardIndex
        );

        try {
          updateCardOrderInSupabase(updatedCards);
        } catch (error) {
          console.error("Error updating card order in Supabase:", error);
        }

        return updatedCards;
      });
    }

    const isOverAList = over.data.current?.type === "List";

    //Drop a card over a list
    if (isActiveACard && isOverAList) {
      setCards((cards: Array<CardType>) => {
        const newCards = [...cards];
        const activeCardIndex = newCards.findIndex(
          (card) => card.id === activeId
        );

        if (activeCardIndex === -1) return cards;

        newCards[activeCardIndex].listId = overId;

        const reorderedCards = arrayMove(newCards, activeCardIndex, activeCardIndex);

        try {
          updateCardOrderInSupabase(reorderedCards);
        } catch (error) {
          console.error("Error updating card order in Supabase:", error);
        }
        return reorderedCards;
      });
    }
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
  
      // Handle list reordering
      if (activeType === "List" && overType === "List") {
        const activeListIndex = newList.findIndex((list) => list.id === active.id);
        const overListIndex = newList.findIndex((list) => list.id === over.id);
  
        if (activeListIndex === -1 || overListIndex === -1) return lists;
  
        const reorderedLists = arrayMove(newList, activeListIndex, overListIndex);
  
        // Save reordered lists to Supabase
        const reorderedListsWithOrder = reorderedLists.map((list, index) => ({
          ...list,
          order: index, // Update order field
        }));
        updateListOrderInSupabase(reorderedListsWithOrder);
  
        return reorderedLists;
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
  );
};

export { Board };
