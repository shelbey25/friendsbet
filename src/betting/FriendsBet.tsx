"use client"

import {  useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Trophy, Clock, DollarSign } from "lucide-react"
import { useQuery, getBettingLines, getAllUsers, createBet, getAllBets } from 'wasp/client/operations'
import { BetWithLine } from "wasp/src/bet/queries"


//Only place bets depending on how much cash is allotted to a player and remove cash from account

const BettingLinesSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="overflow-hidden">
        <CardHeader className="bg-gray-50 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent className="py-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="px-4">
              <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse ml-auto"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)


const LeaderboardSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    ))}
  </div>
)

const RecentBetsSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-3 bg-gray-50 rounded-md">
        <div className="flex justify-between items-start mb-2">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-3 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
)

// Types
interface BettingLine {
  id: string
  event: string
  date: string
  time: string
  team1: string
  team2: string
  odds1: number
  odds2: number
  total?: number
  overOdds?: number
  underOdds?: number
  isMoneyline: boolean
  category: string
}



// Mock data

export function BettingDashboard() {

  const { data: bettingLines, isLoading } = useQuery(getBettingLines)


  const { data: leaderboardData, isLoading: isLoadingLeaderboard } = useQuery(getAllUsers)

  const { data: recentBets, isLoading: isLoadingBets } = useQuery(getAllBets)


  const [selectedLine, setSelectedLine] = useState<BettingLine | null>(null)
  const [betAmount, setBetAmount] = useState<string>("10")
  const [selectedTeam, setSelectedTeam] = useState<"team1" | "team2" | "over" | "under" | null>(null)

  const handleSelectLine = (line: BettingLine, selection: "team1" | "team2" | "over" | "under") => {
    setSelectedLine(line)
    setSelectedTeam(selection)
  }

  const calculatePotentialWin = () => {
    if (!selectedLine || !selectedTeam || !betAmount) return 0

    let odds: number
    if (selectedTeam === "team1") {
      odds = selectedLine.odds1
    } else if (selectedTeam === "team2") {
      odds = selectedLine.odds2
    } else if (selectedTeam === "over") {
      odds = selectedLine.overOdds || 0
    } else if (selectedTeam === "under") {
      odds = selectedLine.underOdds || 0
    } else {
      return 0
    }

    const amount = Number.parseFloat(betAmount)

    if (isNaN(amount)) return 0

    if (odds > 0) {
      return amount * (odds / 100)
    } else {
      return amount * (100 / Math.abs(odds))
    }
  }

  const handlePlaceBet = () => {
    let selectionText = ""
    if (selectedTeam === "team1") {
      selectionText = selectedLine?.team1 || ""
    } else if (selectedTeam === "team2") {
      selectionText = selectedLine?.team2 || ""
    } else if (selectedTeam === "over") {
      selectionText = `Over ${selectedLine?.total}`
    } else if (selectedTeam === "under") {
      selectionText = `Under ${selectedLine?.total}`
    }
    void (async () => {
    await createBet({
      lineId: selectedLine?.id || "",
      amount: parseFloat(betAmount),
      selection: selectionText,
      potentialWin: parseFloat(calculatePotentialWin().toFixed(2)),
    }).then(() => {

    alert(
      `${selectedLine?.event}\nBet placed: $${betAmount} on ${selectionText.toLowerCase()} to win $${calculatePotentialWin().toFixed(2)}`,
    )
    setSelectedLine(null)
    setSelectedTeam(null)
    setBetAmount("10")
  })
  })()
  }

  const [selectedTab, setSelectedTab] = useState("all")


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="all" className="w-full" value={selectedTab} onValueChange={setSelectedTab}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Betting Lines</h2>
              <TabsList className="bg-gray-100 p-1">
                <TabsTrigger className={`${selectedTab == "all" ? "bg-white drop-shadow-md" : ""}`} value="all">All</TabsTrigger>
                <TabsTrigger className={`${selectedTab == "Get With" ? "bg-white drop-shadow-md" : ""}`} value="Get With">Get With</TabsTrigger>
                <TabsTrigger className={`${selectedTab == "Dating" ? "bg-white drop-shadow-md" : ""}`} value="Dating">Dating</TabsTrigger>
                <TabsTrigger className={`${selectedTab == "Achievements" ? "bg-white drop-shadow-md" : ""}`} value="Achievements">Achievements</TabsTrigger>
                <TabsTrigger className={`${selectedTab == "Misc" ? "bg-white drop-shadow-md" : ""}`} value="Misc">Misc</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-4">
              {isLoading ? <BettingLinesSkeleton /> : bettingLines?.map((line) => (
                <Card key={line.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-100 py-3">
                    <div className="flex justify-between items-center pt-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs font-medium">
                          {line.category.toUpperCase()}
                        </Badge>
                        <Badge variant={line.isMoneyline ? "default" : "secondary"} className="bg-black text-white text-xs font-medium">
                          {line.isMoneyline ? "MONEYLINE" : "OVER/UNDER"}
                        </Badge>
                        <CardTitle className="text-sm font-medium">{line.event}</CardTitle>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {line.date} • {line.time}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-4">
                    {line.isMoneyline ? (
                      // Moneyline betting
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium">{line.team1}</div>
                          <Button
                            variant={selectedLine?.id === line.id && selectedTeam === "team1" ? "default" : "outline"}
                             className={`mt-2 w-full justify-between transition-all duration-200 ${
    selectedLine?.id === line.id && selectedTeam === "team1"
      ? "border-2 border-blue-500 bg-blue-50 shadow-md"
      : ""
  }`}
                            onClick={() => handleSelectLine(line, "team1")}
                          >
                            <span>Select</span>
                            <span className={line.odds1 > 0 ? "text-green-600" : "text-red-600"}>
                              {line.odds1 > 0 ? `+${line.odds1}` : line.odds1}
                            </span>
                          </Button>
                        </div>
                        <div className="px-4 text-center">
                          <span className="text-sm font-medium text-gray-500">VS</span>
                        </div>
                        <div className="flex-1 text-right">
                          <div className="font-medium">{line.team2}</div>
                          <Button
                            variant={selectedLine?.id === line.id && selectedTeam === "team2" ? "default" : "outline"}
                             className={`mt-2 w-full justify-between transition-all duration-200 ${
    selectedLine?.id === line.id && selectedTeam === "team2"
      ? "border-2 border-blue-500 bg-blue-50 shadow-md"
      : ""
  }`}
                            onClick={() => handleSelectLine(line, "team2")}
                          >
                            <span>Select</span>
                            <span className={line.odds2 > 0 ? "text-green-600" : "text-red-600"}>
                              {line.odds2 > 0 ? `+${line.odds2}` : line.odds2}
                            </span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Over/Under betting
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold mb-2">{line.event} </div>
                          <div className="text-sm text-gray-600">O/U {line.total}</div>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex-1">
                            <div className="font-medium text-center mb-2">Over {line.total}</div>
                            <Button
                              variant={selectedLine?.id === line.id && selectedTeam === "over" ? "default" : "outline"}
                              className={`mt-2 w-full justify-between transition-all duration-200 ${
    selectedLine?.id === line.id && selectedTeam === "over"
      ? "border-2 border-blue-500 bg-blue-50 shadow-md"
      : ""
  }`}
                              onClick={() => handleSelectLine(line, "over")}
                            >
                              <span>Select</span>
                              <span className={(line.overOdds || 0) > 0 ? "text-green-600" : "text-red-600"}>
                                {(line.overOdds || 0) > 0 ? `+${line.overOdds}` : line.overOdds}
                              </span>
                            </Button>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-center mb-2">Under {line.total}</div>
                            <Button
                              variant={selectedLine?.id === line.id && selectedTeam === "under" ? "default" : "outline"}
                               className={`mt-2 w-full justify-between transition-all duration-200 ${
    selectedLine?.id === line.id && selectedTeam === "under"
      ? "border-2 border-blue-500 bg-blue-50 shadow-md"
      : ""
  }`}
                              onClick={() => handleSelectLine(line, "under")}
                            >
                              <span>Select</span>
                              <span className={(line.underOdds || 0) > 0 ? "text-green-600" : "text-red-600"}>
                                {(line.underOdds || 0) > 0 ? `+${line.underOdds}` : line.underOdds}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {bettingLines ? <>{["Get With", "Dating", "Achievements", "Misc"].map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                {bettingLines
                  .filter((line) => line.category === category)
                  .map((line) => (
                    <Card key={line.id} className="overflow-hidden">
                      <CardHeader className="bg-gray-50 py-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs font-medium">
                              {line.category.toUpperCase()}
                            </Badge>
                            <Badge variant={line.isMoneyline ? "default" : "secondary"} className="text-xs font-medium">
                              {line.isMoneyline ? "MONEYLINE" : "OVER/UNDER"}
                            </Badge>
                            <CardTitle className="text-sm font-medium">{line.event}</CardTitle>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {line.date} • {line.time}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="py-4">
                        {line.isMoneyline ? (
                          // Moneyline betting
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="font-medium">{line.team1}</div>
                              <Button
                                variant={selectedLine?.id === line.id && selectedTeam === "team1" ? "default" : "outline"}
                                className="mt-2 w-full justify-between"
                                onClick={() => handleSelectLine(line, "team1")}
                              >
                                <span>Select</span>
                                <span className={line.odds1 > 0 ? "text-green-600" : "text-red-600"}>
                                  {line.odds1 > 0 ? `+${line.odds1}` : line.odds1}
                                </span>
                              </Button>
                            </div>
                            <div className="px-4 text-center">
                              <span className="text-sm font-medium text-gray-500">VS</span>
                            </div>
                            <div className="flex-1 text-right">
                              <div className="font-medium">{line.team2}</div>
                              <Button
                                variant={selectedLine?.id === line.id && selectedTeam === "team2" ? "default" : "outline"}
                                className="mt-2 w-full justify-between"
                                onClick={() => handleSelectLine(line, "team2")}
                              >
                                <span>Select</span>
                                <span className={line.odds2 > 0 ? "text-green-600" : "text-red-600"}>
                                  {line.odds2 > 0 ? `+${line.odds2}` : line.odds2}
                                </span>
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // Over/Under betting
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="text-lg font-semibold mb-2">Total Points: {line.total}</div>
                              <div className="text-sm text-gray-600">{line.team1} vs {line.team2}</div>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                              <div className="flex-1">
                                <div className="font-medium text-center mb-2">Over {line.total}</div>
                                <Button
                                  variant={selectedLine?.id === line.id && selectedTeam === "over" ? "default" : "outline"}
                                  className="w-full justify-between"
                                  onClick={() => handleSelectLine(line, "over")}
                                >
                                  <span>Select</span>
                                  <span className={(line.overOdds || 0) > 0 ? "text-green-600" : "text-red-600"}>
                                    {(line.overOdds || 0) > 0 ? `+${line.overOdds}` : line.overOdds}
                                  </span>
                                </Button>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-center mb-2">Under {line.total}</div>
                                <Button
                                  variant={selectedLine?.id === line.id && selectedTeam === "under" ? "default" : "outline"}
                                  className="w-full justify-between"
                                  onClick={() => handleSelectLine(line, "under")}
                                >
                                  <span>Select</span>
                                  <span className={(line.underOdds || 0) > 0 ? "text-green-600" : "text-red-600"}>
                                    {(line.underOdds || 0) > 0 ? `+${line.underOdds}` : line.underOdds}
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>
            ))}</> : null}
          </Tabs>
        </div>

        <div className="space-y-6">
          {/* Bet Slip */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bet Slip</CardTitle>
              <CardDescription>Place your bet</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedLine && selectedTeam ? (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-100 rounded-md">
                    <div className="text-sm font-medium">{selectedLine.event}</div>
                    <div className="mt-1 flex justify-between">
                      <div className="text-sm">
                        {selectedTeam === "team1"
                          ? selectedLine.team1
                          : selectedTeam === "team2"
                            ? selectedLine.team2
                            : selectedTeam === "over"
                              ? `Over ${selectedLine.total}`
                              : `Under ${selectedLine.total}`}
                      </div>
                      <div className="text-sm font-medium">
                        {selectedTeam === "team1"
                          ? selectedLine.odds1 > 0
                            ? `+${selectedLine.odds1}`
                            : selectedLine.odds1
                          : selectedTeam === "team2"
                            ? selectedLine.odds2 > 0
                              ? `+${selectedLine.odds2}`
                              : selectedLine.odds2
                            : selectedTeam === "over"
                              ? (selectedLine.overOdds || 0) > 0
                                ? `+${selectedLine.overOdds}`
                                : selectedLine.overOdds
                              : (selectedLine.underOdds || 0) > 0
                                ? `+${selectedLine.underOdds}`
                                : selectedLine.underOdds}
                      </div>
                    </div>
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        {selectedLine.isMoneyline ? "Moneyline" : "Over/Under"}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bet Amount</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        className="pl-8"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-gray-100 rounded-md">
                    <div className="flex justify-between text-sm">
                      <span>Potential Win:</span>
                      <span className="font-medium">${calculatePotentialWin().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Total Return:</span>
                      <span className="font-medium">
                        ${(Number.parseFloat(betAmount || "0") + calculatePotentialWin()).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-gray-400 mb-2">Select a betting line to place a bet</div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${!selectedLine || !selectedTeam || !betAmount || Number.parseFloat(betAmount) <= 0 ? "bg-gray-800 text-white" : "bg-black text-white"}`}
                disabled={!selectedLine || !selectedTeam || !betAmount || Number.parseFloat(betAmount) <= 0}
                onClick={handlePlaceBet}
              >
                Place Bet
              </Button>
            </CardFooter>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Leaderboard</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingLeaderboard ? <LeaderboardSkeleton /> : !leaderboardData ? null : leaderboardData.slice(0, 5).map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-800 text-xs font-medium">
                        {index+1}
                      </div>
                      <Avatar className={"bg-gray-200"
                      }>
                        <AvatarFallback>{user.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">${user.balance}</div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <a href="/leaderboard" className="w-full bg-transparent"><Button variant="outline" className="w-full bg-transparent">
                View Full Leaderboard
              </Button></a>
            </CardFooter>
          </Card>

          {/* Recent Bets */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Bets</CardTitle>
            </CardHeader>
            <CardContent >
              <div className="space-y-4">
                {isLoadingBets ? <RecentBetsSkeleton /> : !recentBets ? null : recentBets.map((bet: BetWithLine) => (
                  <div key={bet.id} className="p-3 bg-gray-100 rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-medium">{bet.selection}</div>
                      <div
                        
                        className={`text-xs p-1  rounded-lg px-2 ${ bet.status === "pending" ? "border-2" : bet.status === "won" ? "bg-black text-white text-semibold" : "bg-red-700 text-white text-semibold"}`}
                      >
                        {bet.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">{bet.line.event}</div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>Bet: ${bet.amount}</span>
                      <div className="flex items-center">
                        {bet.status === "won" ? (
                          <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                        ) : bet.status === "lost" ? (
                          <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                        ) : (
                          <TrendingUp className="h-3 w-3 text-blue-500 mr-1" />
                        )}
                        <span
                          className={
                            bet.status === "won"
                              ? "text-green-600"
                              : bet.status === "lost"
                                ? "text-red-600"
                                : "text-blue-600"
                          }
                        >
                          {bet.status === "pending"
                            ? `Potential: $${bet.potentialWin.toFixed(2)}`
                            : bet.status === "won"
                              ? `Won: $${bet.potentialWin.toFixed(2)}`
                              : `Lost: $${bet.amount}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <a href="/history" className="w-full bg-transparent"><Button variant="outline" className="w-full bg-transparent">
                View All Bets
              </Button></a>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
