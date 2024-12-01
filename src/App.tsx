import { Card } from './components/Card'
import { List } from './components/List'
import { AddCardButton } from './components/AddCardButton'
import { Layout } from './components/Layout'
import { AddListButton } from './components/AddListButton'
import './App.css'
import { EditCardModal } from './components/EditCardModal'
import { ConfirmationModal } from './components/ConfirmationModal'

function App() {

  return (
    <>
      <h1 className = 'title'>TRELLO BOARD</h1>
      <Layout>
        <List>
          <AddCardButton />
          <Card />
          <Card />
        </List>
        <List>
          <AddCardButton />
          <Card />
          <Card />
        </List>
        <List>
          <AddListButton />
        </List>
        <EditCardModal />
        <ConfirmationModal />
      </Layout>
    </>
  )
}

export default App
