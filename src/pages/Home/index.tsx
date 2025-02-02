import { useContext } from "react";
import { Board } from "../../components/Board";
import { TrelloBoardContext } from "../../Context";
import { Loading } from "../../components/Loading";
import "./Home.css";
import { Sidebar } from "../../components/Sidebar";
//import { useNavigate } from "react-router-dom"

const Home = (): JSX.Element => {
  const { kanbanBoards, loading, createBoard } = useContext(TrelloBoardContext);

  return (
    <>
      {loading ? (
        <div className="home">
          <Sidebar />
          <Loading />
        </div>
      ) : (
        <div className="home">
          <Sidebar />
          {kanbanBoards.length === 0 ? (
            <div className="empty-board">
              <div className="empty-state__no-boards">
                <div className="empty-state__no-boards-card empty-state__no-boards-card--large">
                  <div className="empty-state__no-boards-card__header">
                    <div></div>
                    <div></div>
                  </div>
                  <div className="empty-state__no-boards-card__content"></div>
                  <div className="empty-state__no-boards-card__footer"></div>
                </div>
                <div className="empty-state__no-boards-card empty-state__no-boards-card--medium"></div>
                <div className="empty-state__no-boards-card empty-state__no-boards-card--small"></div>
              </div>
              <h1 className="empty-state__title">
                Get Started by Creating a New Board
              </h1>
              <p className="empty-state__description">
                Click the button below or the + icon in the sidebar to add your
                first board.
              </p>
              <button
                className="add-list-button--empty-state"
                onClick={createBoard}
              >
                Create a Board
              </button>
            </div>
          ) : (
            <Board />
          )}
        </div>
      )}
    </>
  );
};

export { Home };
