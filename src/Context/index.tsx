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
  setLists: Dispatch<SetStateAction<Array<ListType>>>;
  createList: (id: Id) => void;
  updateTitleList: (title: string, id: Id) => void;
  deleteList: (id: Id) => void;
  targetListId: Id | null;
  openConfirmationModal: (id: Id) => void;
  addCards: (card: ListType) => void;
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
}

export const TrelloBoardContext = createContext<TrelloBoardContextProps>({
  kanbanBoards: [],
  setKanbanBoards: () => {},
  lists: [],
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
});

export const TrelloBoardProvider = ({ children }: PropsWithChildren) => {
  const [lists, setLists] = useState<TrelloBoardContextProps["lists"]>([]);
  const [kanbanBoards, setKanbanBoards] = useState<TrelloBoardContextProps["kanbanBoards"]>([]);
  const [cardToEdit, setCardToEdit] = useState<CardType | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [targetListId, setTargetListId] = useState<Id | null>(null);
  const [isCardEdited, setIsCardEdited] = useState(false);

  // Function to get the boards from supabase
  const getBoards = async () => {
    const { data, error } = await supabase.from("boards").select("*");
    if (error) {
      console.log("error", error);
    } else {
      if (data) {
        setKanbanBoards(data);
      }
    }
  };
  useEffect(() => {
    getBoards();
  }, []);

  // Function to create a new list
  const createList = (boardId: Id): void => {
    const newColumn: ListType = {
      boardId: boardId,
      id: uuid(), // Generate a unique ID for the new list
      title: `List ${lists.length + 1}`, // Set the title of the new list
      cards: [], // Initialize with an empty array of cards
    };
    setLists([...lists, newColumn]); // Add the new list to the existing lists
  };

  // Function to update the title of a list
  const updateTitleList = (title: string, id: Id): void => {
    setLists((lists) =>
      lists.map((list) => {
        if (list.id === id) {
          return { ...list, title }; // Update the title if the ID matches
        }
        return list; // Return the list unchanged if the ID does not match
      })
    );
  };

  // Function to delete a list
  const deleteList = (id: Id): void => {
    setLists((prevLists) => {
      const updatedLists = prevLists.filter((list) => list.id !== id);
      return updatedLists;
    });
    setIsConfirmationModalOpen(false);
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
  const addCards = (card: ListType): void => {
    const cardToAdd: CardType = {
      id: uuid(), // Generate a unique ID for the new card
      title: "Card's title", // Set a default title for the new card
      description:
        "This is a description preview. To edit this card, please click on the icon in the right top", // Set a default description
      priority: "Low", // Set a default priority
    };
    setLists((lists) =>
      lists.map((list) => {
        if (list.id === card.id) {
          return { ...list, cards: [...(list.cards || []), cardToAdd] }; // Add the new card to the list if the ID matches
        }
        return list; // Return the list unchanged if the ID does not match
      })
    );
  };

  //function to send a card to edit
  const sendCardToEdit = (card: CardType) => {
    setIsCardEdited(false);
    setCardToEdit(card);
  };

  // Function to edit a card
  const editCard = (cardToEdit: CardType): void => {
    setLists((lists) =>
      lists.map((list) => {
        const updatedCards = list.cards?.map((card) => {
          if (card.id === cardToEdit.id) {
            return cardToEdit; // Update the card if the ID matches
          }
          return card; // Return the card unchanged if the ID does not match
        });
        return { ...list, cards: updatedCards }; // Update the list with the updated cards
      })
    );
  };

  const deleteCard = (cardId: Id): void => {
    setLists((lists) =>
      lists.map((list) => {
        const updatedCards = list.cards?.filter((card) => card.id !== cardId); // Filter out the card with the matching ID
        return { ...list, cards: updatedCards }; // Update the list with the filtered cards
      })
    );
    setCardToEdit(null);
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
      }}
    >
      {children}
    </TrelloBoardContext.Provider>
  );
};
