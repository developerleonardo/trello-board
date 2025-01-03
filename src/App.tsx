import { BrowserRouter, useNavigate, useRoutes, useLocation } from "react-router-dom";
import { TrelloBoardContext, TrelloBoardProvider } from "./Context";
import { Home } from "./pages/Home";
import { Login } from "./pages/login";
import { NotFound } from "./pages/NotFound";
import { supabase } from "./supabase/client";
import "./App.css";
import { useContext, useEffect } from "react";

const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {isGuest} = useContext(TrelloBoardContext);


  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (isGuest) {
        navigate("/");
      } else {
        if (!session && location.pathname !== "/signin") {
          navigate("/signin");
        } else if (session && location.pathname === "/signin") {
          navigate("/");
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname, isGuest]);

  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/signin", element: <Login /> },
    { path: "/*", element: <NotFound /> },
  ]);

  return routes;
};

function App(): JSX.Element {
  

  return (
    <>
      <BrowserRouter>
        <TrelloBoardProvider>
          <AppRoutes />
        </TrelloBoardProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
