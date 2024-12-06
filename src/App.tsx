import { v4 as uuid } from 'uuid';
//import { Card } from "./components/Card";
import { List } from "./components/List";
import { Layout } from "./components/Layout";
import { EditCardModal } from "./components/EditCardModal";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { ListType } from "./types";
import { useState } from "react";
import "./App.css";

interface AppStateProps {
  lists: Array<ListType>;
}

function App() {
  const [lists, setLists] = useState<AppStateProps["lists"]>([]);

  const createList = (): void => {
    const newColumn: ListType = {
      id: uuid(),
      title: `List ${lists.length + 1}`,
    }
    setLists([...lists, newColumn]);
  };

  const deleteList = (id: ListType['id']): void => {
    const filteredLists = lists.filter((list) => list.id !== id)
    setLists(filteredLists);
  }

  return (
    <>
      <h1 className="title">TRELLO BOARD</h1>
      <Layout>
        {lists.map((list) => (
          <List key={list.id} title={list.title} id={list.id} deleteList={deleteList} />
        ))}
        <button className="add-list-button" onClick={() => createList()}>
          <span className="add-list-button__plus">+</span>
          <span className="add-list-button__text">Add List</span>
        </button>
        <EditCardModal />
        <ConfirmationModal />
      </Layout>
    </>
  );
}

export default App;
