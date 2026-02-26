import {
  BrowserRouter,
  useNavigate,
  useRoutes,
  useLocation,
} from "react-router-dom";
import { TrelloBoardProvider } from "./Context";
import { Home } from "./pages/Home";
import { Login } from "./pages/login";
import { NotFound } from "./pages/NotFound";
import { supabase } from "./supabase/client";
import { useEffect } from "react";
import { SignUp } from "./pages/SignUp";
import { ResetPassword } from "./pages/ResetPassword";
import { UpdatePassword } from "./pages/UpdatePassword";
import "./App.css";

const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //const { isGuest } = useContext(TrelloBoardContext);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Si el usuario está logueado y está en páginas de auth → mandarlo al home
        if (session) {
          if (
            ["/signin", "/signup", "/recover-password"].includes(
              location.pathname,
            )
          ) {
            navigate("/");
          }
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/signin", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/recover-password", element: <ResetPassword /> },
    { path: "/account/update-password", element: <UpdatePassword /> },
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
