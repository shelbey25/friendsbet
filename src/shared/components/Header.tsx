import { logout, useAuth } from "wasp/client/auth";
import { Link } from "wasp/client/router";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import { Button, ButtonLink } from "./Button";
import { useEffect } from "react";

export function Header() {
  const { data: user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login')
    }
  }, [user, isLoading, navigate])

   if (!isLoading && !user) {
    return null
   }

return <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">
            FriendsBet
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <div className="text-sm font-medium text-gray-900">
              Dashboard
            </div>
            <div className="text-sm font-medium text-gray-500 hover:text-gray-900">
              Betting Lines
            </div>
            <div className="text-sm font-medium text-gray-500 hover:text-gray-900">
              Leaderboard
            </div>
            <div  className="text-sm font-medium text-gray-500 hover:text-gray-900">
              History
            </div>
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
