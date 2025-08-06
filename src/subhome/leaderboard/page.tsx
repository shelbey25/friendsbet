import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ArrowUp, ArrowDown, Minus, Trophy } from "lucide-react"
import { useState } from "react"
import { getAllUsers, useQuery } from "wasp/client/operations"


const LeaderboardTableSkeleton = () => (
  <div className="overflow-x-auto w-full ">
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
          </th>
          <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          </th>
          <th className="text-right py-3 px-4 font-medium text-sm text-gray-500">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div>
          </th>
          <th className="text-right py-3 px-4 font-medium text-sm text-gray-500">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <tr key={i} className="border-b last:border-0">
            <td className="py-3 px-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                {i <= 3 && (
                  <div className="ml-2 h-5 w-8 bg-gray-200 rounded animate-pulse"></div>
                )}
              </div>
            </td>
            <td className="py-3 px-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </td>
            <td className="py-3 px-4 text-right">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div>
            </td>
            <td className="py-3 px-4">
              <div className="flex items-center justify-end">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export function LeaderboardPage() {
  // This would come from your database in a real app
  const { data: users, isLoading } = useQuery(getAllUsers)
  

  const getChangeIcon = (change: string) => {
    switch (change) {
      case "up":
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case "down":
        return <ArrowDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }
    const [selectedTab, setSelectedTab] = useState("balance")
  

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
        </div>

        <Tabs defaultValue="balance" className="w-full" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-gray-100 p-1 mb-6">
            <TabsTrigger className={`${selectedTab == "balance" ? "bg-white drop-shadow-md" : ""}`} value="balance">Balance</TabsTrigger>
            <TabsTrigger className={`${selectedTab == "winnings" ? "bg-white drop-shadow-md" : ""}`} value="winnings">Finalized</TabsTrigger>
          </TabsList>

          <TabsContent value="balance">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                  Top Players by Balance
                </CardTitle>
                <CardDescription>Players ranked by their current balance</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? <LeaderboardTableSkeleton/> : !users ? null : <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Rank</th>
                        <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Player</th>
                        <th className="text-right py-3 px-4 font-medium text-sm text-gray-500">Balance</th>
                        <th className="text-right py-3 px-4 font-medium text-sm text-gray-500">Change</th>
                      </tr>
                    </thead>
                    <tbody className="w-full">
                      {users.map((user, index) => (
                        <tr key={user.id} className="border-b last:border-0">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                  index+1 === 1
                                    ? "bg-yellow-100 text-yellow-800"
                                    : index+1 === 2
                                      ? "bg-gray-100 text-gray-800"
                                      : index+1 === 3
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-gray-50 text-gray-600"
                                }`}
                              >
                                {index+1}
                              </div>
                              {index+1 <= 3 && (
                                <Badge
                                  variant="outline"
                                  className={`ml-2 ${
                                    index+1 === 1
                                      ? "border-yellow-200 bg-yellow-50 text-yellow-800"
                                      : index+1 === 2
                                        ? "border-gray-200 bg-gray-50 text-gray-800"
                                        : "border-amber-200 bg-amber-50 text-amber-800"
                                  }`}
                                >
                                  {index+1 === 1 ? "1st" : index+1 === 2 ? "2nd" : "3rd"}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>{user.initials}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">${user.balance}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end">{getChangeIcon("same")}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="winnings">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                  Top Players by Finalized Value
                </CardTitle>
                <CardDescription>Players ranked by their value ignoring pending bets</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? <LeaderboardTableSkeleton/> : !users ? null : <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Rank</th>
                        <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Player</th>
                        <th className="text-right py-3 px-4 font-medium text-sm text-gray-500">Finalized</th>
                        <th className="text-right py-3 px-4 font-medium text-sm text-gray-500">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? null : !users ? null : [...users]
                        .sort((a, b) => b.winnings - a.winnings)
                        .map((user, index) => (
                          <tr key={user.id} className="border-b last:border-0">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                    index === 0
                                      ? "bg-yellow-100 text-yellow-800"
                                      : index === 1
                                        ? "bg-gray-100 text-gray-800"
                                        : index === 2
                                          ? "bg-amber-100 text-amber-800"
                                          : "bg-gray-50 text-gray-600"
                                  }`}
                                >
                                  {index + 1}
                                </div>
                                {index <= 2 && (
                                  <Badge
                                    variant="outline"
                                    className={`ml-2 ${
                                      index === 0
                                        ? "border-yellow-200 bg-yellow-50 text-yellow-800"
                                        : index === 1
                                          ? "border-gray-200 bg-gray-50 text-gray-800"
                                          : "border-amber-200 bg-amber-50 text-amber-800"
                                    }`}
                                  >
                                    {index === 0 ? "1st" : index === 1 ? "2nd" : "3rd"}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarFallback>{user.initials}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{user.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right font-medium">${user.winnings}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end">{getChangeIcon("same")}</div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}


