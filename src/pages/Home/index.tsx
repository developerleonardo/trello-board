import { useContext, useEffect } from "react";
import { Board } from "../../components/Board";
import { supabase } from "../../supabase/client";
import { TrelloBoardContext } from "../../Context";
import { Loading } from "../../components/Loading";
//import { useNavigate } from "react-router-dom"

const Home = (): JSX.Element => {
  const { kanbanBoards } = useContext(TrelloBoardContext);

  // const navigate = useNavigate()

  // const getUser = async () => {
  //   const {data: user, error} = await supabase.auth.getUser()
  //   if(error) {
  //     console.error(error)
  //     return
  //   }
  //   if(!user) {
  //     navigate("/signin")
  //     return
  //   }
  // }

  // useEffect(() => {
  //   getUser()
  // }, [navigate])

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
      {kanbanBoards.length === 0 ? <Loading /> : <Board />}
      <button onClick={logOut}>Log out</button>
    </>
  );
};

export { Home };
