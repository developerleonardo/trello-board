import { useContext, useEffect } from "react";
import { Board } from "../../components/Board";
import { supabase } from "../../supabase/client";
import { TrelloBoardContext } from "../../Context";
import { Loading } from "../../components/Loading";
import "./Home.css";
//import { useNavigate } from "react-router-dom"

const Home = (): JSX.Element => {
  const { kanbanBoards } = useContext(TrelloBoardContext);

  const getUser = async () => {
    const { data: user } = await supabase.auth.getUser();
    return user;
  };

  useEffect(() => {
    getUser();
  }, []);

  const logOut = async () => {
    await supabase.auth.signOut();
  };
  return (
    <>
      <button className="button log-out__button" onClick={logOut}>Log out</button>
      {kanbanBoards.length === 0 ? <Loading /> : <Board />}
    </>
  );
};

export { Home };
