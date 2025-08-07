"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Switch } from "../components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog"
import { Plus, Edit, Trash2, CheckCircle, Clock, Users, DollarSign, TrendingUp } from 'lucide-react'
import { getEveryoneBets, getUnfinalizedBettingLines, setBetResult, updateBettingLine, useQuery } from "wasp/client/operations"
import { BetWithLineAndUser } from "wasp/src/bet/queries"

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
  status: "active" | "completed" | "cancelled"
  result?: "team1" | "team2" | "over" | "under" | "cancelled"
  totalBets: number
  totalAmount: number
}

interface Bet {
  id: string
  userId: string
  userName: string
  lineId: string
  lineName: string
  selection: string
  amount: number
  potentialWin: number
  status: "pending" | "won" | "lost"
  date: string
}

// Mock data
const initialBettingLines: BettingLine[] = [
  {
    id: "1",
    event: "NFL Week 10",
    date: "2024-11-12",
    time: "13:00",
    team1: "Kansas City Chiefs",
    team2: "Las Vegas Raiders",
    odds1: -320,
    odds2: +260,
    isMoneyline: true,
    category: "football",
    status: "active",
    totalBets: 15,
    totalAmount: 2500,
  },
  {
    id: "2",
    event: "NBA Regular Season",
    date: "2024-11-11",
    time: "19:30",
    team1: "Boston Celtics",
    team2: "New York Knicks",
    total: 218.5,
    overOdds: -105,
    underOdds: -115,
    odds1: 0,
    odds2: 0,
    isMoneyline: false,
    category: "basketball",
    status: "completed",
    result: "over",
    totalBets: 8,
    totalAmount: 1200,
  },
  {
    id: "3",
    event: "Premier League",
    date: "2024-11-14",
    time: "10:00",
    team1: "Manchester City",
    team2: "Liverpool",
    total: 2.5,
    overOdds: -140,
    underOdds: +120,
    odds1: 0,
    odds2: 0,
    isMoneyline: false,
    category: "soccer",
    status: "active",
    totalBets: 12,
    totalAmount: 1800,
  },
]

const mockBets: Bet[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Alex Johnson",
    lineId: "1",
    lineName: "Kansas City Chiefs vs Las Vegas Raiders",
    selection: "Kansas City Chiefs",
    amount: 100,
    potentialWin: 31.25,
    status: "pending",
    date: "2024-11-10",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Sarah Williams",
    lineId: "2",
    lineName: "Boston Celtics vs New York Knicks",
    selection: "Over 218.5",
    amount: 50,
    potentialWin: 47.62,
    status: "won",
    date: "2024-11-08",
  },
  {
    id: "3",
    userId: "user3",
    userName: "Mike Thompson",
    lineId: "3",
    lineName: "Manchester City vs Liverpool",
    selection: "Under 2.5",
    amount: 75,
    potentialWin: 90.00,
    status: "pending",
    date: "2024-11-07",
  },
]

export function AdminDashboard() {
  const [bettingLines, setBettingLines] = useState<BettingLine[]>(initialBettingLines)

 const { data: unfinalizedBets, isLoading: isLoadingUnfinalizedBets } = useQuery(getUnfinalizedBettingLines)

 const { data: allBets, isLoading: isLoadingAllBets } = useQuery(getEveryoneBets)

 

  const [bets, setBets] = useState<Bet[]>(mockBets)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  //const [editingLine, setEditingLine] = useState<BettingLine | null>(null)
  const [newLine, setNewLine] = useState({
    event: "",
    date: "",
    time: "",
    team1: "",
    team2: "",
    odds1: -110,
    odds2: -110,
    total: 0,
    overOdds: -110,
    underOdds: -110,
    isMoneyline: true,
    category: "football",
  })

  const handleCreateLine = () => {
    const line: BettingLine = {
      id: Date.now().toString(),
      ...newLine,
      status: "active",
      totalBets: 0,
      totalAmount: 0,
    }
    setBettingLines([...bettingLines, line])
    setNewLine({
      event: "",
      date: "",
      time: "",
      team1: "",
      team2: "",
      odds1: -110,
      odds2: -110,
      total: 0,
      overOdds: -110,
      underOdds: -110,
      isMoneyline: true,
      category: "football",
    })
    setIsCreateDialogOpen(false)
  }

  const handleSetResult = (lineId: string, result: string) => {
    updateBettingLine({lineId}).then(() => {
      setBetResult({
      lineId,
      correctSelection: result,
     }).then(() => {
      alert(`Bet successfully reconciled!`)
     })
    })

    
    
    //if isMoneyline and then set the users

  }

  const handleDeleteLine = (lineId: string) => {
    setBettingLines(lines => lines.filter(line => line.id !== lineId))
    setBets(currentBets => currentBets.filter(bet => bet.lineId !== lineId))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getResultBadge = (result?: string) => {
    if (!result) return null
    
    const colors = {
      team1: "bg-purple-100 text-purple-800",
      team2: "bg-purple-100 text-purple-800", 
      over: "bg-orange-100 text-orange-800",
      under: "bg-orange-100 text-orange-800",
      cancelled: "bg-gray-100 text-gray-800"
    }
    
    return (
      <Badge className={`${colors[result as keyof typeof colors]} hover:${colors[result as keyof typeof colors]}`}>
        {result.charAt(0).toUpperCase() + result.slice(1)}
      </Badge>
    )
  }

  const activeLinesCount = bettingLines.filter(line => line.status === "active").length
  const totalBetsCount = bets.length
  const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0)
  const pendingBetsCount = bets.filter(bet => bet.status === "pending").length

  const [selectedTab, setSelectedTab] = useState("lines")

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Lines</p>
                <p className="text-2xl font-bold text-gray-900">{activeLinesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bets</p>
                <p className="text-2xl font-bold text-gray-900">{totalBetsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900">${totalBetAmount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Bets</p>
                <p className="text-2xl font-bold text-gray-900">{pendingBetsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lines" className="w-full" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6 bg-gray-100 p-1">
          <TabsTrigger value="lines" className={`${selectedTab == "lines" ? "bg-white drop-shadow-md" : ""}`}>Betting Lines</TabsTrigger>
          <TabsTrigger value="bets" className={`${selectedTab == "bets" ? "bg-white drop-shadow-md" : ""}`}>All Bets</TabsTrigger>
          <TabsTrigger value="results" className={`${selectedTab == "results" ? "bg-white drop-shadow-md" : ""}`}>Set Results</TabsTrigger>
        </TabsList>

        {/* Betting Lines Management */}
        <TabsContent value="lines">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Manage Betting Lines</CardTitle>
                  <CardDescription>Create, edit, and manage betting lines</CardDescription>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Line
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Betting Line</DialogTitle>
                      <DialogDescription>
                        Set up a new betting line for users to bet on
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="event">Event Name</Label>
                          <Input
                            id="event"
                            value={newLine.event}
                            onChange={(e) => setNewLine({...newLine, event: e.target.value})}
                            placeholder="NFL Week 10"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select value={newLine.category} onValueChange={(value) => setNewLine({...newLine, category: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="football">Football</SelectItem>
                              <SelectItem value="basketball">Basketball</SelectItem>
                              <SelectItem value="baseball">Baseball</SelectItem>
                              <SelectItem value="soccer">Soccer</SelectItem>
                              <SelectItem value="mma">MMA</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newLine.date}
                            onChange={(e) => setNewLine({...newLine, date: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newLine.time}
                            onChange={(e) => setNewLine({...newLine, time: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="team1">Team 1 / Fighter 1</Label>
                          <Input
                            id="team1"
                            value={newLine.team1}
                            onChange={(e) => setNewLine({...newLine, team1: e.target.value})}
                            placeholder="Kansas City Chiefs"
                          />
                        </div>
                        <div>
                          <Label htmlFor="team2">Team 2 / Fighter 2</Label>
                          <Input
                            id="team2"
                            value={newLine.team2}
                            onChange={(e) => setNewLine({...newLine, team2: e.target.value})}
                            placeholder="Las Vegas Raiders"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="bet-type"
                          checked={newLine.isMoneyline}
                          onCheckedChange={(checked) => setNewLine({...newLine, isMoneyline: checked})}
                        />
                        <Label htmlFor="bet-type">
                          {newLine.isMoneyline ? "Moneyline Betting" : "Over/Under Betting"}
                        </Label>
                      </div>

                      {newLine.isMoneyline ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="odds1">Team 1 Odds</Label>
                            <Input
                              id="odds1"
                              type="number"
                              value={newLine.odds1}
                              onChange={(e) => setNewLine({...newLine, odds1: Number(e.target.value)})}
                              placeholder="-110"
                            />
                          </div>
                          <div>
                            <Label htmlFor="odds2">Team 2 Odds</Label>
                            <Input
                              id="odds2"
                              type="number"
                              value={newLine.odds2}
                              onChange={(e) => setNewLine({...newLine, odds2: Number(e.target.value)})}
                              placeholder="-110"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="total">Total Points</Label>
                            <Input
                              id="total"
                              type="number"
                              step="0.5"
                              value={newLine.total}
                              onChange={(e) => setNewLine({...newLine, total: Number(e.target.value)})}
                              placeholder="218.5"
                            />
                          </div>
                          <div>
                            <Label htmlFor="overOdds">Over Odds</Label>
                            <Input
                              id="overOdds"
                              type="number"
                              value={newLine.overOdds}
                              onChange={(e) => setNewLine({...newLine, overOdds: Number(e.target.value)})}
                              placeholder="-110"
                            />
                          </div>
                          <div>
                            <Label htmlFor="underOdds">Under Odds</Label>
                            <Input
                              id="underOdds"
                              type="number"
                              value={newLine.underOdds}
                              onChange={(e) => setNewLine({...newLine, underOdds: Number(e.target.value)})}
                              placeholder="-110"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateLine}>Create Line</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bettingLines.map((line) => (
                  <Card key={line.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{line.category.toUpperCase()}</Badge>
                          <Badge variant={line.isMoneyline ? "default" : "secondary"}>
                            {line.isMoneyline ? "MONEYLINE" : "OVER/UNDER"}
                          </Badge>
                          {getStatusBadge(line.status)}
                          {getResultBadge(line.result)}
                        </div>
                        <h3 className="font-semibold text-lg">{line.event}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {line.team1} vs {line.team2} • {line.date} at {line.time}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{line.totalBets} bets</span>
                          <span>${line.totalAmount} volume</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Betting Line</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the betting line and all associated bets. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteLine(line.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Bets */}
        <TabsContent value="bets">
          <Card>
            <CardHeader>
              <CardTitle>All Bets</CardTitle>
              <CardDescription>View and manage all user bets</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAllBets ? null : !allBets ? null : <div className="space-y-4">
                {allBets.map((bet: BetWithLineAndUser) => (
                  <Card key={bet.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{bet.user.name}</Badge>
                          <Badge
                            variant={
                              bet.status === "pending" ? "outline" : 
                              bet.status === "won" ? "default" : "destructive"
                            }
                            className={`${bet.status === "won" || bet.status === "lost"  ? "bg-black text-white" : ""}`}
                          >
                            {bet.status.toUpperCase()}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{bet.line.event}</h4>
                        <p className="text-sm text-gray-600">Selection: {bet.selection}</p>
                        <p className="text-sm text-gray-500">Date: {bet.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${bet.amount}</p>
                        <p className="text-sm text-gray-500">
                          Potential: ${bet.potentialWin.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Set Results */}
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Set Results</CardTitle>
              <CardDescription>Set results for completed games to settle bets</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUnfinalizedBets ? null : !unfinalizedBets ? null : <div className="space-y-4">
                {unfinalizedBets
                  .map((line) => (
                    <Card key={line.id} className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1 ">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{line.category.toUpperCase()}</Badge>
                            <Badge variant={line.isMoneyline ? "default" : "secondary"} className="bg-gray-200">
                              {line.isMoneyline ? "MONEYLINE" : "OVER/UNDER"}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg">{line.event}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {line.isMoneyline ? `${line.team1} vs ${line.team2}` : "Over/Under " + line.total}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2 ">
                          {line.isMoneyline ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleSetResult(line.id, line.team1)}
                                className="w-full min-w-[200px] bg-gray-100 hover:bg-gray-200 border"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {line.team1} Wins
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSetResult(line.id, line.team2)}
                                className="w-full min-w-[200px] bg-gray-100 hover:bg-gray-200 border"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {line.team2} Wins
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleSetResult(line.id, `Over ${line.total}`)}
                                className="w-full min-w-[200px] bg-gray-100 hover:bg-gray-200 border"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Over {line.total}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSetResult(line.id, `Under ${line.total}`)}
                                className="w-full min-w-[200px] bg-gray-100 hover:bg-gray-200 border"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Under {line.total}
                              </Button>
                            </>
                          )}
                      
                        </div>
                      </div>
                    </Card>
                  ))}
                
                {unfinalizedBets.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No active lines to set results for.</p>
                  </div>
                )}
              </div>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
