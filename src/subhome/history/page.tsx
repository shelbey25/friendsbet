import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"
import { useState } from "react"

/*const BetHistorySkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="p-4 border rounded-lg bg-white">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="h-5 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-1"></div>
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="pt-3 border-t flex justify-between items-center">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex items-center space-x-3">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)*/

export function HistoryPage() {
  // This would come from your database in a real app
  const bets = [
    {
      id: "1",
      event: "Kansas City Chiefs vs Las Vegas Raiders",
      selection: "Kansas City Chiefs",
      odds: -320,
      amount: 100,
      potentialWin: 31.25,
      status: "won",
      date: "Nov 10, 2023",
      category: "football",
    },
    {
      id: "2",
      event: "Boston Celtics vs New York Knicks",
      selection: "Boston Celtics",
      odds: -180,
      amount: 50,
      potentialWin: 27.78,
      status: "won",
      date: "Nov 8, 2023",
      category: "basketball",
    },
    {
      id: "3",
      event: "Manchester City vs Liverpool",
      selection: "Liverpool",
      odds: +210,
      amount: 75,
      potentialWin: 157.5,
      status: "lost",
      date: "Nov 7, 2023",
      category: "soccer",
    },
    {
      id: "4",
      event: "Los Angeles Dodgers vs New York Yankees",
      selection: "Los Angeles Dodgers",
      odds: -110,
      amount: 110,
      potentialWin: 100,
      status: "pending",
      date: "Nov 13, 2023",
      category: "baseball",
    },
    {
      id: "5",
      event: "Jon Jones vs Francis Ngannou",
      selection: "Jon Jones",
      odds: -150,
      amount: 150,
      potentialWin: 100,
      status: "pending",
      date: "Nov 15, 2023",
      category: "mma",
    },
    {
      id: "6",
      event: "Dallas Cowboys vs Philadelphia Eagles",
      selection: "Philadelphia Eagles",
      odds: -130,
      amount: 130,
      potentialWin: 100,
      status: "lost",
      date: "Nov 5, 2023",
      category: "football",
    },
    {
      id: "7",
      event: "Los Angeles Lakers vs Golden State Warriors",
      selection: "Los Angeles Lakers",
      odds: -115,
      amount: 115,
      potentialWin: 100,
      status: "won",
      date: "Nov 3, 2023",
      category: "basketball",
    },
    {
      id: "8",
      event: "Arsenal vs Tottenham",
      selection: "Arsenal",
      odds: +120,
      amount: 100,
      potentialWin: 120,
      status: "won",
      date: "Nov 1, 2023",
      category: "soccer",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "won":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Won</Badge>
      case "lost":
        return <Badge variant="destructive">Lost</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-blue-600">
            Pending
          </Badge>
        )
      default:
        return null
    }
  }
    const [selectedTab, setSelectedTab] = useState("all")
  

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Betting History</h1>
        </div>

        <Tabs defaultValue="all" className="w-full" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-gray-100 p-1 mb-6">
            <TabsTrigger className={`${selectedTab == "all" ? "bg-white drop-shadow-md" : ""}`} value="all">All Bets</TabsTrigger>
            <TabsTrigger className={`${selectedTab == "won" ? "bg-white drop-shadow-md" : ""}`} value="won">Won</TabsTrigger>
            <TabsTrigger className={`${selectedTab == "lost" ? "bg-white drop-shadow-md" : ""}`} value="lost">Lost</TabsTrigger>
            <TabsTrigger className={`${selectedTab == "pending" ? "bg-white drop-shadow-md" : ""}`} value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>All Bets</CardTitle>
                <CardDescription>Your complete betting history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bets.map((bet) => (
                    <div key={bet.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{bet.event}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            Selection: {bet.selection} ({bet.odds > 0 ? `+${bet.odds}` : bet.odds})
                          </div>
                        </div>
                        {getStatusBadge(bet.status)}
                      </div>
                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {bet.date}
                        </div>
                        <div className="flex items-center">
                          <div className="text-sm text-gray-500 mr-3">Bet: ${bet.amount}</div>
                          <div className="flex items-center">
                            {bet.status === "won" ? (
                              <>
                                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                                <span className="text-sm font-medium text-green-600">
                                  +${bet.potentialWin.toFixed(2)}
                                </span>
                              </>
                            ) : bet.status === "lost" ? (
                              <>
                                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                                <span className="text-sm font-medium text-red-600">-${bet.amount.toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="text-sm font-medium text-blue-600">
                                Potential: +${bet.potentialWin.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {["won", "lost", "pending"].map((status) => (
            <TabsContent key={status} value={status}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>{status.charAt(0).toUpperCase() + status.slice(1)} Bets</CardTitle>
                  <CardDescription>
                    {status === "won"
                      ? "Bets you've won"
                      : status === "lost"
                        ? "Bets you've lost"
                        : "Bets awaiting results"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bets
                      .filter((bet) => bet.status === status)
                      .map((bet) => (
                        <div key={bet.id} className="p-4 border rounded-lg bg-white">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{bet.event}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                Selection: {bet.selection} ({bet.odds > 0 ? `+${bet.odds}` : bet.odds})
                              </div>
                            </div>
                            {getStatusBadge(bet.status)}
                          </div>
                          <div className="mt-3 pt-3 border-t flex justify-between items-center">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {bet.date}
                            </div>
                            <div className="flex items-center">
                              <div className="text-sm text-gray-500 mr-3">Bet: ${bet.amount}</div>
                              <div className="flex items-center">
                                {bet.status === "won" ? (
                                  <>
                                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                                    <span className="text-sm font-medium text-green-600">
                                      +${bet.potentialWin.toFixed(2)}
                                    </span>
                                  </>
                                ) : bet.status === "lost" ? (
                                  <>
                                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                                    <span className="text-sm font-medium text-red-600">-${bet.amount.toFixed(2)}</span>
                                  </>
                                ) : (
                                  <span className="text-sm font-medium text-blue-600">
                                    Potential: +${bet.potentialWin.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    {bets.filter((bet) => bet.status === status).length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No {status} bets found.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
