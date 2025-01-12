import { supabase } from "../../supabase/client";
import { useContext, useEffect, useState } from "react";
import { TrelloBoardContext } from "../../Context";
import { BoardListItem } from "../BoardListItem/BoardListItem";
import { CiSearch } from "react-icons/ci";
import { IoAddCircleOutline } from "react-icons/io5";
import { FiChevronsLeft, FiLogOut, FiChevronsRight } from "react-icons/fi";
import "./Sidebar.css";

const Sidebar = (): JSX.Element => {
  const { kanbanBoards, isGuest, setIsGuest, createBoard, isSideBarOpen, setIsSideBarOpen } =
    useContext(TrelloBoardContext);

  const [searchInput, setSearchInput] = useState<string>("");

  const getUser = async () => {
    const { data: user } = await supabase.auth.getUser();
    return user;
  };

  useEffect(() => {
    getUser();
  }, []);

  const logOut = async () => {
    await supabase.auth.signOut();
    if (isGuest) {
      setIsGuest(false);
    }
  };

  const filteredBoards = kanbanBoards.filter((board) => {
    return board.title.toLowerCase().includes(searchInput.toLowerCase());
  });

  return (
    <>
      {isSideBarOpen && 
        <aside className="sidebar">
          <div className="sidebar__header">
            <div className="sidebar__header__logo">
              <img src="./favicon-24x24--white.png" alt="Boardy logo" />
              <h2>Boardy</h2>
            </div>
            <div className="sidebar__header__icons">
              <button onClick={() => setIsSideBarOpen(false)}>
                <FiChevronsLeft />
              </button>
              <button onClick={createBoard}>
                <IoAddCircleOutline />
              </button>
            </div>
          </div>
          <div className="sidebar__search">
            <input
              type="text"
              placeholder="Search a board"
              className="sidebar__search__input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <CiSearch />
          </div>
          <div className="sidebar__boards">
            <h3>Boards</h3>
            <ul className="sidebar__boards__list">
              {filteredBoards.map((board) => (
                <BoardListItem key={board.id} board={board} />
              ))}
            </ul>
          </div>
          <button className="button sidebar__logout__button" onClick={logOut}>
            <FiLogOut />
            <span>Log Out</span>
          </button>
        </aside>
      }
      {
        !isSideBarOpen &&
        <aside className="sidebar__closed">
          <button onClick={() => setIsSideBarOpen(true)} className="sidebar__open__button">
            <FiChevronsRight />
          </button>
        </aside>
      }
    </>
  );
};

export { Sidebar };
