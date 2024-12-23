import { Board } from "./components/Board";
import { TrelloBoardProvider } from "./Context";
import "./App.css";


function App(): JSX.Element {

  return (
    <>
    <TrelloBoardProvider>
      <Board />
    </TrelloBoardProvider>
    </>
  );
}

export default App;
