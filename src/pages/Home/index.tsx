import { useContext } from "react";
import { Board } from "../../components/Board";
import { TrelloBoardContext } from "../../Context";
import { Loading } from "../../components/Loading";
import "./Home.css";
import { Sidebar } from "../../components/Sidebar";
//import { useNavigate } from "react-router-dom"

const Home = (): JSX.Element => {
  const { kanbanBoards } = useContext(TrelloBoardContext);

  return (
    <div className="home">
      <Sidebar />
      {kanbanBoards.length === 0 ? <Loading /> : <Board />}
    </div>
  );
};

export { Home };
