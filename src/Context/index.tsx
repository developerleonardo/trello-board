import {
  createContext,
  PropsWithChildren,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { BoardType, CardType, Id, ListType } from "../types";
import { v4 as uuid } from "uuid";
import { supabase } from "../supabase/client";

interface TrelloBoardContextProps {
  kanbanBoards: Array<BoardType>;
  setKanbanBoards: Dispatch<SetStateAction<Array<BoardType>>>;
  lists: Array<ListType>;
  cards: Array<CardType>;
  setLists: Dispatch<SetStateAction<Array<ListType>>>;
  createList: (id: Id) => void;
  updateTitleList: (title: string, id: Id) => void;
  deleteList: (id: Id) => void;
  targetListId: Id | null;
  openConfirmationModal: (id: Id) => void;
  addCards: (listId: Id) => void;
  editCard: (card: CardType) => void;
  cardToEdit: CardType | null;
  setCardToEdit: Dispatch<SetStateAction<CardType | null>>;
  sendCardToEdit: (card: CardType) => void;
  deleteCard: (cardId: Id) => void;
  isConfirmationModalOpen: boolean;
  setIsConfirmationModalOpen: Dispatch<SetStateAction<boolean>>;
  closeConfirmationModal: () => void;
  isCardEdited: boolean;
  setIsCardEdited: Dispatch<SetStateAction<boolean>>;
  getBoards: () => void;
  selectedBoard: BoardType;
  setCards: Dispatch<SetStateAction<Array<CardType>>>;
}

export const TrelloBoardContext = createContext<TrelloBoardContextProps>({
  kanbanBoards: [],
  setKanbanBoards: () => {},
  lists: [],
  cards: [],
  setLists: () => {},
  createList: () => {},
  updateTitleList: () => {},
  deleteList: () => {},
  targetListId: null,
  openConfirmationModal: () => {},
  addCards: () => {},
  editCard: () => {},
  cardToEdit: null,
  setCardToEdit: () => {},
  sendCardToEdit: () => {},
  deleteCard: () => {},
  isConfirmationModalOpen: false,
  setIsConfirmationModalOpen: () => {},
  closeConfirmationModal: () => {},
  isCardEdited: false,
  setIsCardEdited: () => {},
  getBoards: () => {},
  selectedBoard: { id: "", title: "" },
  setCards: () => {},
});

export const TrelloBoardProvider = ({ children }: PropsWithChildren) => {
  const [kanbanBoards, setKanbanBoards] = useState<
    TrelloBoardContextProps["kanbanBoards"]
  >([]);
  const [lists, setLists] = useState<TrelloBoardContextProps["lists"]>([]);
  const [cards, setCards] = useState<TrelloBoardContextProps["cards"]>([]);
  const [cardToEdit, setCardToEdit] = useState<CardType | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [targetListId, setTargetListId] = useState<Id | null>(null);
  const [isCardEdited, setIsCardEdited] = useState(false);

  // Function to get the boards from supabase
  const getBoards = async () => {
    try {
      const { data, error } = await supabase.from("boards").select("*");
      if(error) throw error;
      if (data) {
        setKanbanBoards(data);
      }
    } catch (error) {
      console.error("error", error);
    }
  };
  // Function to get the lists from supabase
  const getLists = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      const currentUser = user.user;
      if (!currentUser) return;
      const { data, error } = await supabase
        .from("lists")
        .select("*")
        .eq("userId", currentUser.id);
      if (error) throw error;
      if (data) {
        setLists(data);
      }
    } catch (error) {
      console.error("error", error);
    }
  };
  // Function to get the cards from supabase
  const getCards = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      const currentUser = user.user;
      if (!currentUser) return;
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("userId", currentUser.id);
      if (error) throw error;
      if (data) {
        setCards(data);
      }
    } catch(error) {
      console.error("error", error);
    }
  }
  useEffect(() => {
    getBoards();
    getLists();
    getCards();
  }, []);

  // Function to create a new list
  const createList = async (boardId: Id): Promise<void> => {
    const newColumn: ListType = {
      boardId: boardId,
      id: uuid(), // Generate a unique ID for the new list
      title: `List ${lists.length + 1}`, // Set the title of the new list
    };
    try {
      const { data: user } = await supabase.auth.getUser();
      const currentUser = user.user;
      const { error } = await supabase.from("lists").insert({
        id: newColumn.id,
        title: newColumn.title,
        boardId: boardId,
        userId: currentUser?.id,
      });
      if (error) throw error;
      setLists([...lists, newColumn]); // Add the new list to the existing lists
    } catch (error) {
      console.error("error", error);
    }
  };

  // Function to update the title of a list
  const updateTitleList = async (title: string, id: Id): Promise<void> => {
    try {
      const {data: user} = await supabase.auth.getUser();
      const currentUser = user.user;
      if(!currentUser) return;
      const {error} = await supabase.from("lists").update({title}).eq("id", id);
      if(error) throw error;
    setLists((lists) =>
      lists.map((list) => {
        if (list.id === id) {
          return { ...list, title }; // Update the title if the ID matches
        }
        return list; // Return the list unchanged if the ID does not match
      })
    );
    } catch(error) {
      console.error("error", error);
    }
  };

  // Function to delete a list
  const deleteList = async(id: Id): Promise<void> => {
    try {
      const {data: user} = await supabase.auth.getUser();
      const currentUser = user.user;
      if(!currentUser) return;
      const {error} = await supabase.from("lists").delete().eq("id", id);
      if(error) throw error;
      setLists((prevLists) => {
        const updatedLists = prevLists.filter((list) => list.id !== id);
        return updatedLists;
      });
      const cardsToDelete = cards.filter((card) => card.listId === id);
      if(cardsToDelete.length > 0) setCards(cardsToDelete);
      setIsConfirmationModalOpen(false);
    } catch (error) {
      console.error("error", error);
    }
  };

  // Function to open confirmation modal
  const openConfirmationModal = (id: Id): void => {
    setTargetListId(id);
    setIsConfirmationModalOpen(true);
  };

  // Close confirmation modal
  const closeConfirmationModal = (): void => {
    setTargetListId(null);
    setIsConfirmationModalOpen(false);
  };

  // Function to add a card to a list
  const addCards = async (listId: Id): Promise<void> => {
    const cardToAdd: CardType = {
      listId: listId,
      id: uuid(), // Generate a unique ID for the new card
      title: "Card's title", // Set a default title for the new card
      description:
        "This is a description preview. To edit this card, please click on the icon in the right top", // Set a default description
      priority: "Low", // Set a default priority
    };
    try {
      const { data: user } = await supabase.auth.getUser();
      const currentUser = user.user;
      if(!currentUser) return;
      const { error } = await supabase.from("cards").insert({
        id: cardToAdd.id,
        title: cardToAdd.title,
        description: cardToAdd.description,
        priority: cardToAdd.priority,
        listId: listId,
        userId: currentUser.id,
      });
      if (error) throw error;
      setCards([...cards, cardToAdd]); // Add the new card to the existing cards
    } catch (error) {
      console.error("error", error);
    }
  };

  //function to send a card to edit
  const sendCardToEdit = (card: CardType) => {
    setIsCardEdited(false);
    setCardToEdit(card);
  };

  // Function to edit a card
  const editCard = async (cardToEdit: CardType): Promise<void> => {
    try {
      const {data: user} = await supabase.auth.getUser();
      const currentUser = user.user;
      if(!currentUser) return;
      const {error} = await supabase.from("cards").update(cardToEdit).eq("id", cardToEdit.id);
      if(error) throw error;
      setCards((prevCards) => {
        const updatedCards = prevCards.map((card) => {
          if (card.id === cardToEdit.id) {
            return cardToEdit; // Update the card if the ID matches
          }
          return card; // Return the card unchanged if the ID does not match
        });
        return updatedCards;
      });
    } catch(error) {
      console.error(error);
    }
  };

  const deleteCard = async(cardId: Id): Promise<void> => {
    try {
    const {data: user} = await supabase.auth.getUser();
    const currentUser = user.user;
    if(!currentUser) return;
    const {error} = await supabase.from("cards").delete().eq("id", cardId);
    if(error) throw error;
    setCards((prevCards) => {
      const updatedCards = prevCards.filter((card) => card.id !== cardId);
      return updatedCards;
    });
    setCardToEdit(null);
    } catch(error) {
      console.error("error", error);
    }
  };

  const selectedBoard = kanbanBoards[0];

  return (
    <TrelloBoardContext.Provider
      value={{
        kanbanBoards,
        setKanbanBoards,
        lists,
        setLists,
        createList,
        updateTitleList,
        deleteList,
        targetListId,
        openConfirmationModal,
        addCards,
        editCard,
        cardToEdit,
        setCardToEdit,
        sendCardToEdit,
        deleteCard,
        isConfirmationModalOpen,
        setIsConfirmationModalOpen,
        closeConfirmationModal,
        isCardEdited,
        setIsCardEdited,
        getBoards,
        selectedBoard,
        cards,
        setCards,
      }}
    >
      {children}
    </TrelloBoardContext.Provider>
  );
};
