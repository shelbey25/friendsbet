"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog"
import { Plus, Edit, Trash2, CheckCircle, Clock, Users, DollarSign, TrendingUp, Loader2 } from 'lucide-react'
import { createBettingLine, getAllBettingLines, getEveryoneBets, getUnfinalizedBettingLines, setBetResult, updateBettingLine, updateBettingLineFull, useQuery } from "wasp/client/operations"
import { BetWithLineAndUser } from "wasp/src/bet/queries"

// Types
const StatsCardSkeleton = () => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="p-2 bg-gray-100 rounded-lg animate-pulse">
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
          <div className="ml-4 space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const BettingLinesSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex space-x-2">
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  const BetsSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex space-x-2">
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="text-right space-y-2">
              <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )


export function AdminDashboard() {

 const { data: unfinalizedBets, isLoading: isLoadingUnfinalizedBets } = useQuery(getUnfinalizedBettingLines)

 const { data: allBets, isLoading: isLoadingAllBets } = useQuery(getEveryoneBets)

 const { data: bettingLines, isLoading: isLoadingBettingLines, refetch: refetchBettingLines } = useQuery(getAllBettingLines)

 const statusOrder = { "pending": 1, "won": 2, "lost": 3 };

 const [updatingLine, setUpdatingLine] = useState(false)

 const [isEditLine, setIsEditLine] = useState(false)

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
    category: "Misc",
  })

  const [editLine, setEditLine] = useState({
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
    category: "Misc",
  })

  const [creatingLine, setCreatingLine] = useState(false)

  const handleCreateLine = () => {


    if (!newLine.event || (newLine.isMoneyline && (!newLine.team1 || !newLine.team2))) {
      alert("Please fill in all required fields.")
      return
    }
    setCreatingLine(true)

    void (async () => {
      await createBettingLine({
      event: newLine.event,
      date: newLine.date ? newLine.date : "TBD",
      team1: newLine.isMoneyline ? newLine.team1 : "",
      team2: newLine.isMoneyline ? newLine.team2 : "",
      odds1: newLine.isMoneyline ? newLine.odds1 : 0,
      odds2: newLine.isMoneyline ? newLine.odds2 : 0,
      total: !newLine.isMoneyline ? newLine.total : 0,
      overOdds: !newLine.isMoneyline ? newLine.overOdds : 0,
      underOdds: !newLine.isMoneyline ? newLine.underOdds : 0,
      isMoneyline: newLine.isMoneyline,
      category: newLine.category,
    }).then(() => {
      refetchBettingLines()
      setCreatingLine(false)
       alert("New betting line created successfully!")
       
    })
  })()

    //refetch betting lines

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
      category: "Misc",
    })
    setIsCreateDialogOpen(false)
  }

  const [updatingLineContent, setUpdatingLineContent] = useState(false)

  const handleUpdateLine = (lineId: string) => {


    if (!editLine.event || (editLine.isMoneyline && (!editLine.team1 || !editLine.team2))) {
      alert("Please fill in all required fields.")
      return
    }
    setUpdatingLineContent(true)

    void (async () => {
      await updateBettingLineFull({
        id: lineId,
      event: editLine.event,
      date: editLine.date ? editLine.date : "TBD",
      team1: editLine.isMoneyline ? editLine.team1 : "",
      team2: editLine.isMoneyline ? editLine.team2 : "",
      odds1: editLine.isMoneyline ? editLine.odds1 : 0,
      odds2: editLine.isMoneyline ? editLine.odds2 : 0,
      total: !editLine.isMoneyline ? editLine.total : 0,
      overOdds: !editLine.isMoneyline ? editLine.overOdds : 0,
      underOdds: !editLine.isMoneyline ? editLine.underOdds : 0,
      isMoneyline: editLine.isMoneyline,
      category: editLine.category,
    }).then(() => {
      refetchBettingLines()
      setUpdatingLineContent(false)
      alert("Betting line successfully updated!")
       
    })
  })()

    setIsEditLine(false)
  }

  const [settingResult, setSettingResult] = useState(false)

  const handleSetResult = (lineId: string, result: string) => {
    setSettingResult(true)
    updateBettingLine({lineId: lineId, statusUpdate: "complete"}).then(() => {
      setBetResult({
      lineId,
      correctSelection: result,
     }).then(() => {
      setSettingResult(false)
      alert(`Bet successfully reconciled!`)
     })
    })

    
    
    //if isMoneyline and then set the users

  }

  const handleDeleteLine = (lineId: string) => {

  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Open</Badge>
      case "complete":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
      case "closed":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getResultBadge = (result?: string) => {
    if (!result) return null
    
  
    return (
      <Badge className={`bg-orange-100 text-orange-800`}>
        {result.charAt(0).toUpperCase() + result.slice(1)}
      </Badge>
    )
  }
 

  const [selectedTab, setSelectedTab] = useState("lines")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {!unfinalizedBets ? <StatsCardSkeleton/> : <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Lines</p>
                <p className="text-2xl font-bold text-gray-900">{unfinalizedBets?.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>}
        
        {!allBets ? <StatsCardSkeleton/> : <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bets</p>
                <p className="text-2xl font-bold text-gray-900">{allBets?.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>}
        
        {!allBets ? <StatsCardSkeleton/> : <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Volume</p>
                <p className="text-2xl font-bold text-gray-900">${allBets?.filter((bet) => bet.status === "pending").reduce((sum, bet) => sum + bet.amount, 0) || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>}
        
        {!allBets ? <StatsCardSkeleton/> : <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Bets</p>
                <p className="text-2xl font-bold text-gray-900">{allBets?.filter((bet) => bet.status === "pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>}
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
                <Dialog open={creatingLine} >
                  <DialogContent className="max-w-2xl bg-gray-100">
                    <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="text-gray-600">Creating line...</span>
          </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={updatingLine} >
                  <DialogContent className="max-w-2xl bg-gray-100">
                    <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="text-gray-600">Closing line...</span>
          </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={updatingLineContent} >
                  <DialogContent className="max-w-2xl bg-gray-100">
                    <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="text-gray-600">Updating line...</span>
          </div>
                  </DialogContent>
                </Dialog>




                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-black text-white">
                      <Plus className="h-4 w-4 mr-2 text-white" />
                      Create Line
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-gray-100">
                    <DialogHeader>
                      <DialogTitle>Create New Betting Line</DialogTitle>
                      <DialogDescription>
                        Set up a new betting line for users to bet on
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="event" className="mb-2">Event Name</Label>
                          <Input
                            id="event"
                            value={newLine.event}
                            onChange={(e) => setNewLine({...newLine, event: e.target.value})}
                            placeholder="Event"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category" className="mb-2">Category</Label>
                          <Select value={newLine.category} onValueChange={(value) => setNewLine({...newLine, category: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="Misc">Misc</SelectItem>
                              <SelectItem value="Get With">Get With</SelectItem>
                              <SelectItem value="Dating">Dating</SelectItem>
                              <SelectItem value="Achievements">Achievements</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date" className="mb-2">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newLine.date}
                            onChange={(e) => setNewLine({...newLine, date: e.target.value})}
                          />
                        </div>
                        
                      </div>


                      <div className="flex items-center space-x-2 w-full">
                     
                        <Button variant="outline" className={`flex-grow ${!newLine.isMoneyline ? "bg-gray-100 hover:bg-gray-200" : "bg-black text-white"} `} onClick={() => setNewLine({...newLine, isMoneyline: true})}>
                        Moneyline Betting
                      </Button>
                      <Button variant="outline" className={`flex-grow ${newLine.isMoneyline ? "bg-gray-100 hover:bg-gray-200" : "bg-black text-white"} `} onClick={() => setNewLine({...newLine, isMoneyline: false})}>
                        Over/Under Betting
                      </Button>
               
                      </div>

                      {newLine.isMoneyline ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                          <Label htmlFor="team1" className="mb-2">Result 1</Label>
                          <Input
                            id="team1"
                            value={newLine.team1}
                            onChange={(e) => setNewLine({...newLine, team1: e.target.value})}
                            placeholder="Kansas City Chiefs Win"
                          />
                        </div>
                        <div>
                          <Label htmlFor="team2" className="mb-2">Result 2</Label>
                          <Input
                            id="team2"
                            value={newLine.team2}
                            onChange={(e) => setNewLine({...newLine, team2: e.target.value})}
                            placeholder="Las Vegas Raiders Win"
                          />
                        </div>
                          <div>
                            <Label htmlFor="odds1" className="mb-2">Result 1 Odds</Label>
                            <Input
                              id="odds1"
                              type="number"
                              value={newLine.odds1}
                              onChange={(e) => setNewLine({...newLine, odds1: Number(e.target.value)})}
                              placeholder="-110"
                            />
                          </div>
                          <div>
                            <Label htmlFor="odds2" className="mb-2">Team 2 Odds</Label>
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
                            <Label htmlFor="total" className="mb-2">Points Line</Label>
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
                            <Label htmlFor="overOdds" className="mb-2">Over Odds</Label>
                            <Input
                              id="overOdds"
                              type="number"
                              value={newLine.overOdds}
                              onChange={(e) => setNewLine({...newLine, overOdds: Number(e.target.value)})}
                              placeholder="-110"
                            />
                          </div>
                          <div>
                            <Label htmlFor="underOdds" className="mb-2">Under Odds</Label>
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
                      <Button onClick={handleCreateLine} className="bg-black text-white">Create Line</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>


              </div>
            </CardHeader>
            <CardContent>
              {isLoadingBettingLines ? <BettingLinesSkeleton /> : !bettingLines ? null : <div className="space-y-4">
                {bettingLines.map((line) => (
                  <Card key={line.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{line.category.toUpperCase()}</Badge>
                          <Badge variant={line.isMoneyline ? "default" : "secondary"} className="bg-gray-200">
                            {line.isMoneyline ? "MONEYLINE" : "OVER/UNDER"}
                          </Badge>
                          {getStatusBadge(line.status)}
                          {line.winner ? getResultBadge(line.winner) : null}
                        </div>
                        <h3 className="font-semibold text-lg">{line.event}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {line.team1 ? line.team1 : "O"}{line.team2 ? " vs " : "/"}{line.team2 ? line.team2 : "U"}  {"(" + (line.team1 ? (line.odds1 > 0 ? "+" + line.odds1 : line.odds1) + "/" + (line.odds2 > 0 ? "+" + line.odds2 : line.odds2) : line.total) + ")"} • {line.date}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{line.bets.length} bets</span>
                          <span>${line.bets.reduce((sum, bet) => sum + bet.amount, 0)} volume</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {line.status === "open" ? <><Button variant="outline" size="sm" className="hover:bg-gray-200" onClick={
                          () => {
                            setUpdatingLine(true)
                            updateBettingLine({lineId: line.id, statusUpdate: "closed"}).then(() => {
      refetchBettingLines()
      setUpdatingLine(false)
      alert(`Betting line successfully closed!`)
     })
                          }
                        }>
                          Close Line
                        </Button>


                        <Dialog open={isEditLine} onOpenChange={setIsEditLine}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => {
                      setEditLine({
                        event: line.event,
                        date: line.date,
                        time: "",
                        team1: line.team1,
                        team2: line.team2,
                        odds1: line.odds1,
                        odds2: line.odds2,
                        total: line.total,
                        overOdds: line.overOdds,
                        underOdds: line.underOdds,
                        isMoneyline: line.isMoneyline,
                        category: line.category,
                        })
                    }}> 
                            <Edit className="h-4 w-4" />
                          </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-gray-100">
                    <DialogHeader>
                      <DialogTitle>Update Betting Line</DialogTitle>
                      <DialogDescription>
                        Set up a new betting line for users to bet on
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="event" className="mb-2">Event Name</Label>
                          <Input
                            id="event"
                            value={editLine.event}
                            onChange={(e) => setEditLine({...editLine, event: e.target.value})}
                            placeholder="Event"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category" className="mb-2">Category</Label>
                          <Select value={editLine.category} onValueChange={(value) => setEditLine({...editLine, category: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="Misc">Misc</SelectItem>
                              <SelectItem value="Get With">Get With</SelectItem>
                              <SelectItem value="Dating">Dating</SelectItem>
                              <SelectItem value="Achievements">Achievements</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date" className="mb-2">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={editLine.date}
                            onChange={(e) => setEditLine({...editLine, date: e.target.value})}
                          />
                        </div>
                        
                      </div>


                      <div className="flex items-center space-x-2 w-full">
                     
                        <Button variant="outline" className={`flex-grow ${!editLine.isMoneyline ? "bg-gray-100 hover:bg-gray-200" : "bg-black text-white"} `} onClick={() => setEditLine({...editLine, isMoneyline: true})}>
                        Moneyline Betting
                      </Button>
                      <Button variant="outline" className={`flex-grow ${editLine.isMoneyline ? "bg-gray-100 hover:bg-gray-200" : "bg-black text-white"} `} onClick={() => setEditLine({...editLine, isMoneyline: false})}>
                        Over/Under Betting
                      </Button>
               
                      </div>

                      {editLine.isMoneyline ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                          <Label htmlFor="team1" className="mb-2">Result 1</Label>
                          <Input
                            id="team1"
                            value={editLine.team1}
                            onChange={(e) => setEditLine({...editLine, team1: e.target.value})}
                            placeholder="Kansas City Chiefs Win"
                          />
                        </div>
                        <div>
                          <Label htmlFor="team2" className="mb-2">Result 2</Label>
                          <Input
                            id="team2"
                            value={editLine.team2}
                            onChange={(e) => setEditLine({...editLine, team2: e.target.value})}
                            placeholder="Las Vegas Raiders Win"
                          />
                        </div>
                          <div>
                            <Label htmlFor="odds1" className="mb-2">Result 1 Odds</Label>
                            <Input
                              id="odds1"
                              type="number"
                              value={editLine.odds1}
                              onChange={(e) => setEditLine({...editLine, odds1: Number(e.target.value)})}
                              placeholder="-110"
                            />
                          </div>
                          <div>
                            <Label htmlFor="odds2" className="mb-2">Team 2 Odds</Label>
                            <Input
                              id="odds2"
                              type="number"
                              value={editLine.odds2}
                              onChange={(e) => setEditLine({...editLine, odds2: Number(e.target.value)})}
                              placeholder="-110"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="total" className="mb-2">Points Line</Label>
                            <Input
                              id="total"
                              type="number"
                              step="0.5"
                              value={editLine.total}
                              onChange={(e) => setEditLine({...editLine, total: Number(e.target.value)})}
                              placeholder="218.5"
                            />
                          </div>
                          <div>
                            <Label htmlFor="overOdds" className="mb-2">Over Odds</Label>
                            <Input
                              id="overOdds"
                              type="number"
                              value={editLine.overOdds}
                              onChange={(e) => setEditLine({...editLine, overOdds: Number(e.target.value)})}
                              placeholder="-110"
                            />
                          </div>
                          <div>
                            <Label htmlFor="underOdds" className="mb-2">Under Odds</Label>
                            <Input
                              id="underOdds"
                              type="number"
                              value={editLine.underOdds}
                              onChange={(e) => setEditLine({...editLine, underOdds: Number(e.target.value)})}
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
                      <Button onClick={() => {handleUpdateLine(line.id)}} className="bg-black text-white">Update Line</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                        </> : null}
                        
                        {/*<AlertDialog>
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
                        </AlertDialog>*/}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>}
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
              {isLoadingAllBets ? <BetsSkeleton/> : !allBets ? null : <div className="space-y-4">
                {allBets.sort((a, b) => {
                  if (a.status !== "pending" && a.status !== "won" && a.status !== "lost") return -1
                   if (b.status !== "pending" && b.status !== "won" && b.status !== "lost") return -1
                  return statusOrder[a.status] - statusOrder[b.status]
                }).map((bet: BetWithLineAndUser) => (
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
            <Dialog open={settingResult} >
                  <DialogContent className="max-w-2xl bg-gray-100">
                    <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="text-gray-600">Updating result...</span>
          </div>
                  </DialogContent>
                </Dialog>
            <CardContent>
              {isLoadingUnfinalizedBets ? <BettingLinesSkeleton /> : !unfinalizedBets ? null : <div className="space-y-4">
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
