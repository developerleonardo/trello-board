import {
  createContext,
  PropsWithChildren,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { CardType, Id, ListType } from "../types";
import { v4 as uuid } from "uuid";

interface TrelloBoardContextProps {
  lists: Array<ListType>;
  setLists: Dispatch<SetStateAction<Array<ListType>>>;
  createList: () => void;
  updateTitleList: (title: string, id: Id) => void;
  deleteList: (id: Id) => void;
  addCards: (card: ListType) => void;
  editCard: (card: CardType) => void;
  cardToEdit: CardType | null;
  setCardToEdit: Dispatch<SetStateAction<CardType | null>>;
  sendCardToEdit: (card: CardType) => void;
  deleteCard: (cardId: Id) => void;
  isConfirmationModalOpen: boolean;
  setIsConfirmationModalOpen: Dispatch<SetStateAction<boolean>>;
  checkDeleteListValidity: (id: Id) => void;
  closeConfirmationModal: () => void;
}

export const TrelloBoardContext = createContext<TrelloBoardContextProps>({
  lists: [],
  setLists: () => {},
  createList: () => {},
  updateTitleList: () => {},
  deleteList: () => {},
  addCards: () => {},
  editCard: () => {},
  cardToEdit: null,
  setCardToEdit: () => {},
  sendCardToEdit: () => {},
  deleteCard: () => {},
  isConfirmationModalOpen: false,
  setIsConfirmationModalOpen: () => {},
  checkDeleteListValidity: () => {},
  closeConfirmationModal: () => {},
});

export const TrelloBoardProvider = ({ children }: PropsWithChildren) => {
  const [lists, setLists] = useState<TrelloBoardContextProps["lists"]>([]);
  const [cardToEdit, setCardToEdit] = useState<CardType | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  // Function to create a new list
  const createList = (): void => {
    const newColumn: ListType = {
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
    const filteredLists = lists.filter((list) => list.id !== id); // Filter out the list with the matching ID
    setLists(filteredLists); // Update the state with the filtered lists
    setIsConfirmationModalOpen(false); // Close the confirmation modal
  };

  // Confirm delete list
  const checkDeleteListValidity = (id: Id): void => {
    const list = lists.find((list) => list.id === id);
    if (list && list.cards && list.cards.length > 0) {
      setIsConfirmationModalOpen(true);
    } else {
      deleteList(id);
    }
  };

  // Close confirmation modal
  const closeConfirmationModal = (): void => {
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

  return (
    <TrelloBoardContext.Provider
      value={{
        lists,
        setLists,
        createList,
        updateTitleList,
        deleteList,
        addCards,
        editCard,
        cardToEdit,
        setCardToEdit,
        sendCardToEdit,
        deleteCard,
        isConfirmationModalOpen,
        setIsConfirmationModalOpen,
        checkDeleteListValidity,
        closeConfirmationModal,
      }}
    >
      {children}
    </TrelloBoardContext.Provider>
  );
};
