import { supabase } from "../../supabase/client";
import { useContext, useEffect, useState } from "react";
import { TrelloBoardContext } from "../../Context";
import { BoardListItem } from "../BoardListItem/BoardListItem";
import { EditProfileModal } from "../EditProfileModal";
import { CiSearch } from "react-icons/ci";
import { IoAddCircleOutline } from "react-icons/io5";
import { FiLogOut, FiSidebar } from "react-icons/fi";
import { LuChevronsUpDown } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = (): JSX.Element => {
  const {
    userEmail,
    username,
    profileImage,
    kanbanBoards,
    isGuest,
    setIsGuest,
    createBoard,
    isSideBarOpen,
    setIsSideBarOpen,
  } = useContext(TrelloBoardContext);

  const [searchInput, setSearchInput] = useState<string>("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] =
    useState<boolean>(false);

  const getUser = async () => {
    const { data: user } = await supabase.auth.getUser();
    return user;
  };

  useEffect(() => {
    getUser();
  }, []);

  const closeEditProfileModal = () => {
    setIsEditProfileModalOpen(false);
  };

  const logOut = async () => {
    await supabase.auth.signOut();
    if (isGuest) {
      setIsGuest(false);
    }
  };

  const filteredBoards = kanbanBoards.filter((board) => {
    return board.title.toLowerCase().includes(searchInput.toLowerCase());
  });

  const renderSidebarOpen = () => {
    return (
      <>
        <div className="sidebar__header">
          <div className="sidebar__header__logo">
            <img src="./favicon-24x24--white.png" alt="Boardy logo" />
            <h2>Boardy</h2>
          </div>
        </div>
        {kanbanBoards.length < 10 ? (
          <button onClick={createBoard} className="add__board__button">
            <IoAddCircleOutline /> Add board
          </button>
        ) : (
          <button className="add__board__button" disabled>
            <IoAddCircleOutline /> Add board
          </button>
        )}
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
            {filteredBoards.length > 0 &&
              filteredBoards.map((board) => (
                <BoardListItem key={board.id} board={board} />
              ))}
            {filteredBoards.length === 0 && (
              <div className="no-boards">
                <h3 className="no-boards__title">No boards available</h3>
                <p className="no-boards__description">
                  Create a new board or check your filters
                </p>
              </div>
            )}
          </ul>
        </div>
        <div
          className="sidebar__profile"
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        >
          <figure className="sidebar__profile__figure">
            <img
              src={profileImage || "./blank-profile.png"}
              alt="profile image"
            />
          </figure>
          <div className="sidebar__profile__info">
            <h3>{username}</h3>
            <p>{userEmail}</p>
          </div>
          <button className="sidebar__profile__chevron">
            <LuChevronsUpDown />
          </button>
          {isProfileMenuOpen && (
            <>
              <div className="sidebar__profile__menu">
                <button
                  className="button sidebar__logout__button"
                  onClick={() => {
                    setIsEditProfileModalOpen(!isEditProfileModalOpen);
                    setIsProfileMenuOpen(false);
                  }}
                >
                  <FaUser />
                  <span>Edit Profile</span>
                </button>
                <button
                  className="button sidebar__logout__button"
                  onClick={logOut}
                >
                  <FiLogOut />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          )}
          {isEditProfileModalOpen && (
            <EditProfileModal closeEditProfileModal={closeEditProfileModal} />
          )}
        </div>
      </>
    );
  };

  const renderSidebarClosed = () => {
    return (
      <>
        <img
          src="./favicon-24x24--white.png"
          alt="Boardy logo"
          className="boardy__logo"
        />
        <button onClick={createBoard} className="add__board__button--closed">
          <IoAddCircleOutline />
        </button>
        <button
          className="sidebar__search__button--closed"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
        >
          <CiSearch />
        </button>
        <ul className="sidebar__boards__list--closed">
          {filteredBoards.length > 0 &&
            filteredBoards.map((board) => (
              <BoardListItem key={board.id} board={board} />
            ))}
        </ul>
        <div
          className="sidebar__profile__closed--container"
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        >
          <button className="sidebar__profile--closed">
            <figure className="sidebar__profile__figure">
              <img
                src={profileImage || "./blank-profile.png"}
                alt="profile image"
              />
            </figure>
          </button>
          {isProfileMenuOpen && (
            <>
              <div className="sidebar__profile__menu">
                <button
                  className="button sidebar__logout__button"
                  onClick={() => {
                    setIsEditProfileModalOpen(!isEditProfileModalOpen);
                    setIsProfileMenuOpen(false);
                  }}
                >
                  <FaUser />
                  <span>Edit Profile</span>
                </button>
                <button
                  className="button sidebar__logout__button"
                  onClick={logOut}
                >
                  <FiLogOut />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          )}
          {isEditProfileModalOpen && (
            <EditProfileModal closeEditProfileModal={closeEditProfileModal} />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <aside className={`sidebar ${!isSideBarOpen ? "sidebar--closed" : ""}`}>
        <div className="sidebar__header__icons">
          <button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
            <FiSidebar />
          </button>
        </div>
        {isSideBarOpen ? renderSidebarOpen() : renderSidebarClosed()}
      </aside>
    </>
  );
};

export { Sidebar };
