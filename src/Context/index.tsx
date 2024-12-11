import { createContext, PropsWithChildren, useState, Dispatch, SetStateAction } from "react";
import { CardType, Id, ListType } from "../types";
import { v4 as uuid } from "uuid";

interface TrelloBoardContextProps {
    lists: Array<ListType>;
    setLists: Dispatch<SetStateAction<Array<ListType>>>;
    createList: () => void;
    updateTitleList: (title: string, id: Id) => void;
    deleteList: (id: Id) => void;
    addCards: (card: ListType) => void;
    editCard: () => void;
}

export const TrelloBoardContext = createContext<TrelloBoardContextProps>({
    lists: [],
    setLists: () => {},
    createList: () => {},
    updateTitleList: () => {},
    deleteList: () => {},
    addCards: () => {},
    editCard: () => {},
});


export const TrelloBoardProvider = ({children}: PropsWithChildren) => {
    const [lists, setLists] = useState<TrelloBoardContextProps["lists"]>([]);

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
    }

    // Function to delete a list
    const deleteList = (id: Id): void => {
        const filteredLists = lists.filter((list) => list.id !== id); // Filter out the list with the matching ID
        setLists(filteredLists); // Update the state with the filtered lists
    };

    // Function to add a card to a list
    const addCards = (card: ListType): void => {
        const cardToAdd: CardType = {
            id: uuid(), // Generate a unique ID for the new card
            title: "Card's title", // Set a default title for the new card
            description: 'This is a description preview. For more details go to edit mode', // Set a default description
            priority: 'Low', // Set a default priority
        };
        setLists((lists) =>
            lists.map((list) => {
                if (list.id === card.id) {
                    return { ...list, cards: [...(list.cards || []), cardToAdd] }; // Add the new card to the list if the ID matches
                }
                return list; // Return the list unchanged if the ID does not match
            })
        );
    }

    // Function to edit a card
    const editCard = () => {
        console.log('Edit card');
        
    }

    return (
        <TrelloBoardContext.Provider value={{
            lists,
            setLists,
            createList,
            updateTitleList,
            deleteList,
            addCards,
            editCard
        }}>
            {children}
        </TrelloBoardContext.Provider>
    )
}