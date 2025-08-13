import { useAuth } from "wasp/client/auth";
import "./App.css";
import { BettingDashboard } from "./betting/FriendsBet"
import { LeagueSelector } from "./betting/league-selector";
import { Header } from "./shared/components/Header";
import { Outlet } from "react-router-dom";

export function App() {
    const { data: user, refetch: refetchUser, isLoading } = useAuth()
  
  return ( <main className="flex min-h-screen w-full flex-col bg-neutral-50 text-neutral-800">
      <Header />
      {isLoading ?  <Outlet /> : !user?.leagueId ? <LeagueSelector currentLeague={null} onLeagueChange={async () => {
      await refetchUser()
      return null
    }} /> :
      <Outlet /> }
    </main>)
    
  return (
     <div className={"min-h-screen bg-gray-50"}>
      <header className="bg-white border-b border-gray-200">
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
              <span className="text-xs font-medium text-gray-700">JD</span>
            </span>
          </div>
        </div>
      </header>
      <main>
        <BettingDashboard />

      </main>
    </div>
  );
}



