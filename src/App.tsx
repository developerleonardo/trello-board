import { BrowserRouter, useNavigate, useRoutes, useLocation } from "react-router-dom";
import { TrelloBoardContext, TrelloBoardProvider } from "./Context";
import { Home } from "./pages/Home";
import { Login } from "./pages/login";
import { NotFound } from "./pages/NotFound";
import { supabase } from "./supabase/client";
import { useContext, useEffect } from "react";
import { SignUp } from "./pages/SignUp";
import { ResetPassword } from "./pages/ResetPassword";
import { UpdatePassword } from "./pages/UpdatePassword";
import "./App.css";

const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {isGuest} = useContext(TrelloBoardContext);


  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(( _event, session) => {
      if (isGuest) {
        navigate("/");
      } else {
        if (!session) {
          // Allow unauthenticated users to access certain routes
          if (!["/signin", "/signup", "/recover-password"].includes(location.pathname)) {
            navigate("/signin");
          }
        } else {
          // Authenticated users are redirected away from auth-related pages
          if (["/signin", "/signup", "/recover-password"].includes(location.pathname)) {
            navigate("/");
          }
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
