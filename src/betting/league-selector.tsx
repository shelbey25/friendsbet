"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Users, Plus, Settings, Copy, UserPlus, Crown, UserMinus, Loader2 } from "lucide-react"
import { createLeague, joinLeague } from "wasp/client/operations"

interface League {
  id: string
  name: string
  code: string
  memberCount: number
  isOwner: boolean
}

interface LeagueMember {
  id: string
  name: string
  initials: string
  joinedDate: string
  isOwner: boolean
  balance: number
  status: "active" | "inactive"
}

interface LeagueSelectorProps {
  currentLeague: League | null
  onLeagueChange: () => Promise<null>
}

// Mock leagues data
const mockLeagues: League[] = [
  {
    id: "1",
    name: "College Friends",
    code: "CF2024",
    memberCount: 8,
    isOwner: true,
  },
  {
    id: "2",
    name: "Work Squad",
    code: "WORK99",
    memberCount: 12,
    isOwner: false,
  },
]

// Mock league members
const mockMembers: LeagueMember[] = [
  {
    id: "1",
    name: "Alex Johnson",
    initials: "AJ",
    joinedDate: "Oct 15, 2023",
    isOwner: true,
    balance: 2500,
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Williams",
    initials: "SW",
    joinedDate: "Oct 16, 2023",
    isOwner: false,
    balance: 1800,
    status: "active",
  },
  {
    id: "3",
    name: "Mike Thompson",
    initials: "MT",
    joinedDate: "Oct 18, 2023",
    isOwner: false,
    balance: 1650,
    status: "active",
  },
  {
    id: "4",
    name: "Jessica Lee",
    initials: "JL",
    joinedDate: "Oct 20, 2023",
    isOwner: false,
    balance: 1400,
    status: "active",
  },
  {
    id: "5",
    name: "David Clark",
    initials: "DC",
    joinedDate: "Oct 22, 2023",
    isOwner: false,
    balance: 1250,
    status: "inactive",
  },
]

export function LeagueSelector({ currentLeague, onLeagueChange }: LeagueSelectorProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isJoinOpen, setIsJoinOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [newLeagueName, setNewLeagueName] = useState("")
  const [joinCode, setJoinCode] = useState("")
  const [copiedCode, setCopiedCode] = useState(false)
  const [creatingLeague, setCreatingLeague] = useState(false)

  const handleCreateLeague = () => {
    if (!newLeagueName.trim()) return
setIsCreateOpen(false)
    setCreatingLeague(true)
    createLeague({
      name: newLeagueName
    }).then(() => {
    onLeagueChange().then(() => {
setNewLeagueName("")
      
      setCreatingLeague(false)
      alert("League created successfully!")
    })
      
    })
  }


  const [joiningLeague, setJoiningLeague] = useState(false)
  const handleJoinLeague = () => {
    if (!joinCode.trim()) return
    setIsJoinOpen(false)
setJoiningLeague(true)
joinLeague({
      code: joinCode.toUpperCase()
    }).then(() => {
      setJoiningLeague(false)
      alert("Joined league successfully!")
    }).catch((error) => {
      console.error("Error joining league:", error)
      setJoiningLeague(false)
      alert("Failed to join league. Please check the code and try again.")
    })

    onLeagueChange()
    setJoinCode("")
  }

  const handleCopyCode = async () => {
    if (currentLeague) {
      await navigator.clipboard.writeText(currentLeague.code)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const handleRemoveMember = (memberId: string) => {
    // Mock member removal
    console.log("Removing member:", memberId)
  }


  if (!currentLeague) {
    return (
      <Card className="mb-6">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Users className="h-5 w-5" />
            Join a League
          </CardTitle>
          <CardDescription>Create or join a league to start betting with your friends</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3 justify-center">
          <Dialog open={creatingLeague} >
                  <DialogContent className="max-w-2xl bg-gray-100">
                    <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="text-gray-600">Creating league...</span>
          </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={joiningLeague} >
                  <DialogContent className="max-w-2xl bg-gray-100">
                    <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="text-gray-600">Joining league...</span>
          </div>
                  </DialogContent>
                </Dialog>


          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-black text-white hover:bg-gray-800">
                <Plus className="h-4 w-4" />
                Create League
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-200">
              <DialogHeader>
                <DialogTitle>Create New League</DialogTitle>
                <DialogDescription>Create a private league for you and your friends</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="league-name" className="pb-2">League Name</Label>
                  <Input
                    id="league-name"
                    placeholder="Enter league name"
                    className="border border-gray-300"
                    value={newLeagueName}
                    onChange={(e) => setNewLeagueName(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateLeague} className="w-full bg-black text-white">
                  Create League
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="hover:bg-gray-200">Join League</Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-200">
              <DialogHeader>
                <DialogTitle>Join League</DialogTitle>
                <DialogDescription>Enter the league code to join an existing league</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 ">
                <div>
                  <Label htmlFor="join-code" className=" pb-2">League Code</Label>
                  <Input
                    id="join-code"
                    className="border border-gray-300"
                    placeholder="Enter league code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  />
                </div>
                <Button onClick={handleJoinLeague} className="w-full bg-black text-white">
                  Join League
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardContent className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">{currentLeague.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Code: {currentLeague.code}</span>
                <Badge variant="secondary">{currentLeague.memberCount} members</Badge>
                {currentLeague.isOwner && <Badge variant="outline">Owner</Badge>}
              </div>
            </div>
          </div>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            {/*<DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>*/}
            <DialogContent className="max-w-2xl bg-gray-200">
              <DialogHeader>
                <DialogTitle>League Settings - {currentLeague.name}</DialogTitle>
                <DialogDescription>Manage your league settings and members</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="league-name-edit">League Name</Label>
                      <Input
                        id="league-name-edit"
                        defaultValue={currentLeague.name}
                        disabled={!currentLeague.isOwner}
                      />
                    </div>

                    <div>
                      <Label>League Code</Label>
                      <div className="flex items-center gap-2">
                        <Input value={currentLeague.code} readOnly />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyCode}
                          className="flex items-center gap-2 bg-transparent"
                        >
                          <Copy className="h-4 w-4" />
                          {copiedCode ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Share this code with friends to invite them to your league
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Total Members</Label>
                        <div className="text-2xl font-bold">{currentLeague.memberCount}</div>
                      </div>
                      <div>
                        <Label>Your Role</Label>
                        <div className="text-2xl font-bold">{currentLeague.isOwner ? "Owner" : "Member"}</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="members" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">League Members</h4>
                    {currentLeague.isOwner && (
                      <Button size="sm" variant="outline" className="flex items-center gap-2 bg-transparent">
                        <UserPlus className="h-4 w-4" />
                        Invite Members
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {mockMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{member.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{member.name}</span>
                              {member.isOwner && <Crown className="h-4 w-4 text-yellow-500" />}
                            </div>
                            <div className="text-xs text-gray-500">
                              Joined {member.joinedDate} • Balance: ${member.balance}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant={member.status === "active" ? "default" : "secondary"}>{member.status}</Badge>
                          {currentLeague.isOwner && !member.isOwner && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {currentLeague.isOwner && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-gray-500 mb-2">
                        As the league owner, you can remove members and manage league settings.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
