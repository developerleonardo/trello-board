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
import { fetchBoards, fetchLists, fetchCards } from "../supabaseService";

interface TrelloBoardContextProps {
  kanbanBoards: Array<BoardType>;
  setKanbanBoards: Dispatch<SetStateAction<Array<BoardType>>>;
  editBoard: (id: Id, title: string) => void;
  lists: Array<ListType>;
  cards: Array<CardType>;
  setLists: Dispatch<SetStateAction<Array<ListType>>>;
  createBoard: () => void;
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
  selectedBoard: BoardType;
  changeCurrentBoard: (boardId: Id) => void;
  setCards: Dispatch<SetStateAction<Array<CardType>>>;
  isSuccessMessageOpen: boolean;
  setIsSuccessMessageOpen: Dispatch<SetStateAction<boolean>>;
  isGuest: boolean;
  setIsGuest: Dispatch<SetStateAction<boolean>>;
}

export const TrelloBoardContext = createContext<TrelloBoardContextProps>({
  kanbanBoards: [],
  setKanbanBoards: () => {},
  editBoard: () => {},
  lists: [],
  cards: [],
  setLists: () => {},
  createBoard: () => {},
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
  selectedBoard: { userId: "", id: "", title: "" },
  changeCurrentBoard: () => {},
  setCards: () => {},
  isSuccessMessageOpen: false,
  setIsSuccessMessageOpen: () => {},
  isGuest: false,
  setIsGuest: () => {},
});

export const TrelloBoardProvider = ({ children }: PropsWithChildren) => {
  const [isGuest, setIsGuest] = useState(false);
  const [kanbanBoards, setKanbanBoards] = useState<
    TrelloBoardContextProps["kanbanBoards"]
  >([]);
  const [selectedBoard, setSelectedBoard] = useState<BoardType>(
    kanbanBoards[0]
  );
  const [lists, setLists] = useState<TrelloBoardContextProps["lists"]>([]);
  const [cards, setCards] = useState<TrelloBoardContextProps["cards"]>([]);
  const [cardToEdit, setCardToEdit] = useState<CardType | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [targetListId, setTargetListId] = useState<Id | null>(null);
  const [isCardEdited, setIsCardEdited] = useState(false);
  const [currentUser, setCurrentUser] = useState<Id | null>(null);
  const [isSuccessMessageOpen, setIsSuccessMessageOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        if (!user) return;
        setCurrentUser(user.id);
        if (user) {
          setCurrentUser(user.id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      if (isGuest) {
        // Load guest data from localStorage
        const guestBoards = JSON.parse(
          localStorage.getItem("guestBoards") ||
            "[{ userId: user1 ,id: '1', title: 'TRELLO BOARD' }]"
        );
        const guestLists = JSON.parse(
          localStorage.getItem("guestLists") || "[]"
        );
        const guestCards = JSON.parse(
          localStorage.getItem("guestCards") || "[]"
        );
        setKanbanBoards(guestBoards);
        setSelectedBoard(guestBoards[0]);
        setLists(guestLists);
        setCards(guestCards);
      } else if (currentUser) {
        // Fetch data for logged-in users
        try {
          const [fetchedBoards, fetchedLists, fetchedCards] = await Promise.all(
            [fetchBoards(), fetchLists(currentUser), fetchCards(currentUser)]
          );
          setKanbanBoards(fetchedBoards);
          setSelectedBoard(fetchedBoards[0]);
          setLists(fetchedLists);
          setCards(fetchedCards);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchAllData();
  }, [currentUser, isGuest]);

  // Save guest data to local storage
  const saveGuestData = () => {
    localStorage.setItem("guestBoards", JSON.stringify(kanbanBoards));
    localStorage.setItem("guestLists", JSON.stringify(lists));
    localStorage.setItem("guestCards", JSON.stringify(cards));
  };

  // initialize guest data
  useEffect(() => {
    if (isGuest) {
      saveGuestData();
    }
  }, [kanbanBoards, lists, cards, isGuest]);

  // Function to create a new board
  const createBoard = async (): Promise<void> => {
    if (!isGuest && !currentUser) return;
    const generateNewBoard = (userId: Id): BoardType => {
      return {
        userId,
        id: uuid(), // Generate a unique ID for the new board
        title: "New Board", // Set the title of the new board
      };
    };
    if (isGuest && !currentUser) {
      const newBoard = generateNewBoard(uuid());
      try {
        const updatedBoards = [...kanbanBoards, newBoard];
        setKanbanBoards(updatedBoards); // Add the new board to the existing boards
        localStorage.setItem("guestBoards", JSON.stringify(updatedBoards));
      } catch (error) {
        console.error("error", error);
      }
    }
  };

  const changeCurrentBoard = (boardId: Id): void => {
    const currentBoard = kanbanBoards.find((board) => board.id === boardId);
    if (currentBoard) {
      setSelectedBoard(currentBoard);
    }
  };

  // Function to edit a board
  const editBoard = async (id: Id, title: string): Promise<void> => {
    if (!isGuest && !currentUser) return;
    if (!currentUser && isGuest) {
      try {
        const updatedBoards = kanbanBoards.map((board) => {
          if (board.id === id) {
            return { ...board, title }; // Update the title if the ID matches
          }
          // Synchronize selectedBoard if it's the one being edited
          if (selectedBoard.id === id) {
            setSelectedBoard({ ...selectedBoard, title });
          }
          return board; // Return the board unchanged if the ID does not match
        });
        setKanbanBoards(updatedBoards);
        localStorage.setItem("guestBoards", JSON.stringify(updatedBoards));
      } catch (error) {
        console.error("error", error);
      }
    }
  };

  // Function to create a new list
  const createList = async (boardId: Id): Promise<void> => {
    // Determine the order for the new list
    const newOrder = lists.filter((list) => list.boardId === boardId).length;
    // Generate a new List object
    const generateNewList = (userId: Id): ListType => {
      return {
        userId,
        boardId,
        id: uuid(), // Generate a unique ID for the new list
        title: `List ${lists.length + 1}`, // Set the title of the new list
        order: newOrder, // Set the order of the
      };
    };

    if (currentUser && !isGuest) {
      const newColumn = generateNewList(currentUser);
      try {
        const { error } = await supabase.from("lists").insert({
          id: newColumn.id,
          title: newColumn.title,
          boardId: boardId,
          userId: currentUser,
          order: newColumn.order,
        });
        if (error) throw error;
        setLists([...lists, newColumn]); // Add the new list to the existing lists
      } catch (error) {
        console.error("error", error);
      }
    }
    if (isGuest && !currentUser) {
      const newColumn = generateNewList(uuid());
      try {
        const updatedLists = [...lists, newColumn];
        setLists(updatedLists); // Add the new list to the existing lists
        localStorage.setItem("guestLists", JSON.stringify(updatedLists));
      } catch (error) {
        console.error("error", error);
      }
    }
  };

  // Function to update the title of a list
  const updateTitleList = async (title: string, id: Id): Promise<void> => {
    if (!isGuest && !currentUser) return;
    if (currentUser && !isGuest) {
      try {
        const { error } = await supabase
          .from("lists")
          .update({ title })
          .eq("id", id);
        if (error) throw error;
        setLists((lists) =>
          lists.map((list) => {
            if (list.id === id) {
              return { ...list, title }; // Update the title if the ID matches
            }
            return list; // Return the list unchanged if the ID does not match
          })
        );
      } catch (error) {
        console.error("error", error);
      }
    }
    if (isGuest && !currentUser) {
      try {
        const updatedLists = lists.map((list) => {
          if (list.id === id) {
            return { ...list, title }; // Update the title if the ID matches
          }
          return list; // Return the list unchanged if the ID does not match
        });
        setLists(updatedLists);
        localStorage.setItem("guestLists", JSON.stringify(updatedLists));
      } catch (error) {
        console.error("error", error);
      }
    }
  };

  // Function to delete a list
  const deleteList = async (id: Id): Promise<void> => {
    if (!isGuest && !currentUser) return;
    if (currentUser && !isGuest) {
      try {
        const { error } = await supabase.from("lists").delete().eq("id", id);
        if (error) throw error;
        setLists((prevLists) => {
          const updatedLists = prevLists.filter((list) => list.id !== id);
          return updatedLists;
        });
        const cardsToDelete = cards.filter((card) => card.listId !== id);
        if (cardsToDelete.length > 0) setCards(cardsToDelete);
        setIsConfirmationModalOpen(false);
      } catch (error) {
        console.error("error", error);
      }
    }
    if (isGuest && !currentUser) {
      try {
        const updatedLists = lists.filter((list) => list.id !== id);
        setLists(updatedLists);
        localStorage.setItem("guestLists", JSON.stringify(updatedLists));
        const cardsToDelete = cards.filter((card) => card.listId !== id);
        if (cardsToDelete.length > 0) setCards(cardsToDelete);
        setIsConfirmationModalOpen(false);
      } catch (error) {
        console.error("error", error);
      }
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
    if (!isGuest && !currentUser) return;

    const generateNewCard = (userId: Id): CardType => {
      const cardsOrder = cards.filter((card) => card.listId === listId).length;
      return {
        userId,
        listId,
        id: uuid(), // Generate a unique ID for the new card
        title: "Card's title", // Set a default title for the new card
        description:
          "This is a description preview. To edit this card, please click on the icon in the right top", // Set a default description
        priority: "Low", // Set a default priority
        order: cardsOrder, // Set the order of the new card
      };
    };

    if (currentUser && !isGuest) {
      const cardToAdd = generateNewCard(currentUser);
      try {
        const { error } = await supabase.from("cards").insert({
          id: cardToAdd.id,
          title: cardToAdd.title,
          description: cardToAdd.description,
          priority: cardToAdd.priority,
          listId: listId,
          userId: currentUser,
          order: cardToAdd.order,
        });
        if (error) throw error;
        setCards([...cards, cardToAdd]); // Add the new card to the existing cards
      } catch (error) {
        console.error("error", error);
      }
    }
    if (isGuest && !currentUser) {
      const cardToAdd = generateNewCard(uuid());
      try {
        const updatedCards = [...cards, cardToAdd];
        setCards(updatedCards); // Add the new card to the existing cards
        localStorage.setItem("guestCards", JSON.stringify(updatedCards));
      } catch (error) {
        console.error("error", error);
      }
    }
  };

  //function to send a card to edit
  const sendCardToEdit = (card: CardType) => {
    setIsCardEdited(false);
    setCardToEdit(card);
  };

  // Function to edit a card
  const editCard = async (cardToEdit: CardType): Promise<void> => {
    if (!isGuest && !currentUser) return;
    if (currentUser && !isGuest) {
      try {
        const { error } = await supabase
          .from("cards")
          .update(cardToEdit)
          .eq("id", cardToEdit.id);
        if (error) throw error;
        setCards((prevCards) => {
          const updatedCards = prevCards.map((card) => {
            if (card.id === cardToEdit.id) {
              return cardToEdit; // Update the card if the ID matches
            }
            return card; // Return the card unchanged if the ID does not match
          });
          return updatedCards;
        });
      } catch (error) {
        console.error(error);
      }
    }
    if (isGuest && !currentUser) {
      try {
        const updatedCards = cards.map((card) => {
          if (card.id === cardToEdit.id) {
            return cardToEdit; // Update the card if the ID matches
          }
          return card; // Return the card unchanged if the ID does not match
        });
        setCards(updatedCards);
        localStorage.setItem("guestCards", JSON.stringify(updatedCards));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteCard = async (cardId: Id): Promise<void> => {
    if (!isGuest && !currentUser) return;
    if (currentUser && !isGuest) {
      try {
        if (!currentUser) return;
        const { error } = await supabase
          .from("cards")
          .delete()
          .eq("id", cardId);
        if (error) throw error;
        setCards((prevCards) => {
          const updatedCards = prevCards.filter((card) => card.id !== cardId);
          return updatedCards;
        });
        setCardToEdit(null);
      } catch (error) {
        console.error("error", error);
      }
    }
    if (isGuest && !currentUser) {
      try {
        const updatedCards = cards.filter((card) => card.id !== cardId);
        setCards(updatedCards);
        localStorage.setItem("guestCards", JSON.stringify(updatedCards));
        setCardToEdit(null);
      } catch (error) {
        console.error("error", error);
      }
    }
  };

  return (
    <TrelloBoardContext.Provider
      value={{
        kanbanBoards,
        editBoard,
        setKanbanBoards,
        lists,
        setLists,
        createBoard,
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
        selectedBoard,
        changeCurrentBoard,
        cards,
        setCards,
        isSuccessMessageOpen,
        setIsSuccessMessageOpen,
        isGuest,
        setIsGuest,
      }}
    >
      {children}
    </TrelloBoardContext.Provider>
  );
};
