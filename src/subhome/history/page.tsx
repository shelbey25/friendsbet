import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"
import { useState } from "react"
import { getAllBets, useQuery } from "wasp/client/operations"
import { BetWithLine } from "wasp/server/betting/types"

const BetHistorySkeleton = () => (
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
)

export function HistoryPage() {
  // This would come from your database in a real app
    const { data: bets, isLoading } = useQuery(getAllBets)
  

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
                {isLoading ? (
                  <BetHistorySkeleton />
                ) : !bets ? null : <div className="space-y-4">
                  {bets.map((bet: BetWithLine) => (
                    <div key={bet.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{bet.line.event}</div>
                          <div className="text-sm text-gray-500 mt-1">
                                Selection: {bet.selection} ({bet.line.isMoneyline ? 
                                (bet.selection === bet.line.team1 ? 
                                (bet.line.odds1 > 0 ? `+${bet.line.odds1}` : bet.line.odds1) :
                                (bet.line.odds2 > 0 ? `+${bet.line.odds2}` : bet.line.odds2))
                                 : bet.line.overOdds})
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
                </div> }
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
                  {isLoading ? (
                  <BetHistorySkeleton />
                ) : !bets ? null : <div className="space-y-4">
                    {bets
                      .filter((bet) => bet.status === status)
                      .map((bet: BetWithLine) => (
                        <div key={bet.id} className="p-4 border rounded-lg bg-white">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{bet.line.event}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                Selection: {bet.selection} ({bet.line.isMoneyline ? 
                                (bet.selection === bet.line.team1 ? 
                                (bet.line.odds1 > 0 ? `+${bet.line.odds1}` : bet.line.odds1) :
                                (bet.line.odds2 > 0 ? `+${bet.line.odds2}` : bet.line.odds2))
                                 : bet.line.overOdds})
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
                  </div>}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
