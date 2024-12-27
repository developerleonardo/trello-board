import { useEffect } from "react"
import { Board } from "../../components/Board"
import { supabase } from "../../supabase/client"
//import { useNavigate } from "react-router-dom"

const Home = (): JSX.Element => {

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
    const {data: user} = await supabase.auth.getUser()
    console.log("userID", user.user?.id)
  }

  useEffect(() => {
    getUser()
  }, [])
  

  const logOut = async () => {
    await supabase.auth.signOut()
  }
  return (
    <>
        <Board />
        <button onClick={logOut}>Log out</button>
    </>
  )
}

export { Home }