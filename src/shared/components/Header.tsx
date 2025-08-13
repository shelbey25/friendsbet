import { logout, useAuth } from "wasp/client/auth";
import { Link } from "wasp/client/router";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import { Button, ButtonLink } from "./Button";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function Header() {
  const { data: user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login')
    }
  }, [user, isLoading, navigate])

  const location = useLocation();

   if ((!isLoading && !user) || location.pathname === "/login" || location.pathname === "/signup") {
    return null
   }
   


return <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className={`text-xl font-bold text-gray-900`}>
            FriendsBet
          </a>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className={`${location.pathname == "/" ? " text-gray-900" : "text-gray-500"} text-sm font-medium`}>
              Dashboard
            </a>
            <a href="/leaderboard"  className={`${location.pathname == "/leaderboard" ? " text-gray-900" : "text-gray-500"} text-sm font-medium`}>
              Leaderboard
            </a>
            <a href="/history"   className={`${location.pathname == "/history" ? " text-gray-900" : "text-gray-500"} text-sm font-medium`}>
              History
            </a>
            {user && user.isAdmin ? <a href="/admin"   className={`${location.pathname == "/admin" ? " text-gray-900" : "text-gray-500"} text-sm font-medium`}>
              Admin
            </a> : null}
          </nav>
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
              <span className="text-xs font-medium text-gray-700">{user?.initials}</span>
            </span>
          </div>
        </div>
      </header>

  return (
    <header className="sticky top-0 z-10 flex justify-center border-b border-neutral-200 bg-white shadow">
      <div className="flex w-full max-w-screen-lg items-center justify-between p-4 px-12">
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Todo App Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-semibold">Todo App</h1>
        </Link>
        <nav>
          <ul className="flex gap-4 font-semibold">
            {user ? (
              <li>
                <Button onClick={logout}>Log out</Button>
              </li>
            ) : (
              <>
                <li>
                  <ButtonLink to="/signup">Sign up</ButtonLink>
                </li>
                <li>
                  <ButtonLink to="/login" variant="ghost">
                    Login
                  </ButtonLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
