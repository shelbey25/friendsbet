import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Clock } from "lucide-react"

export function LinesPage() {
  // This would come from your database in a real app
  const bettingLines = [
    {
      id: "1",
      event: "NFL Week 10",
      date: "Nov 12",
      time: "1:00 PM",
      team1: "Kansas City Chiefs",
      team2: "Las Vegas Raiders",
      odds1: -320,
      odds2: +260,
      spread: "KC -7.5",
      total: "O/U 49.5",
      category: "football",
    },
    {
      id: "2",
      event: "NBA Regular Season",
      date: "Nov 11",
      time: "7:30 PM",
      team1: "Boston Celtics",
      team2: "New York Knicks",
      odds1: -180,
      odds2: +150,
      spread: "BOS -4.5",
      total: "O/U 218.5",
      category: "basketball",
    },
    {
      id: "3",
      event: "MLB World Series",
      date: "Nov 13",
      time: "8:00 PM",
      team1: "Los Angeles Dodgers",
      team2: "New York Yankees",
      odds1: -110,
      odds2: -110,
      spread: "LAD -1.5",
      total: "O/U 8.5",
      category: "baseball",
    },
    {
      id: "4",
      event: "Premier League",
      date: "Nov 14",
      time: "10:00 AM",
      team1: "Manchester City",
      team2: "Liverpool",
      odds1: -130,
      odds2: +210,
      spread: "MC -0.5",
      total: "O/U 2.5",
      category: "soccer",
    },
    {
      id: "5",
      event: "UFC 300",
      date: "Nov 15",
      time: "10:00 PM",
      team1: "Jon Jones",
      team2: "Francis Ngannou",
      odds1: -150,
      odds2: +125,
      spread: "N/A",
      total: "N/A",
      category: "mma",
    },
    {
      id: "6",
      event: "NFL Week 10",
      date: "Nov 12",
      time: "4:25 PM",
      team1: "Dallas Cowboys",
      team2: "Philadelphia Eagles",
      odds1: +110,
      odds2: -130,
      spread: "PHI -2.5",
      total: "O/U 51.5",
      category: "football",
    },
    {
      id: "7",
      event: "NBA Regular Season",
      date: "Nov 11",
      time: "10:00 PM",
      team1: "Los Angeles Lakers",
      team2: "Golden State Warriors",
      odds1: -115,
      odds2: -105,
      spread: "LAL -1.5",
      total: "O/U 224.5",
      category: "basketball",
    },
    {
      id: "8",
      event: "Premier League",
      date: "Nov 14",
      time: "12:30 PM",
      team1: "Arsenal",
      team2: "Tottenham",
      odds1: +120,
      odds2: +210,
      spread: "ARS -0.5",
      total: "O/U 2.5",
      category: "soccer",
    },
  ]

  const categories = ["all", "football", "basketball", "baseball", "soccer", "mma"]

  return (
    <div className="min-h-screen bg-gray-50">
      

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Betting Lines</h1>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category === "all" ? "All Lines" : category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-6">
              {(category === "all" ? bettingLines : bettingLines.filter((line) => line.category === category)).map(
                (line) => (
                  <Card key={line.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 py-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs font-medium">
                            {line.category.toUpperCase()}
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-500">Moneyline</div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm">{line.team1}</div>
                            <div
                              className={`text-sm font-medium ${line.odds1 > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {line.odds1 > 0 ? `+${line.odds1}` : line.odds1}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm">{line.team2}</div>
                            <div
                              className={`text-sm font-medium ${line.odds2 > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {line.odds2 > 0 ? `+${line.odds2}` : line.odds2}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-500">Spread</div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm">{line.team1}</div>
                            <div className="text-sm font-medium">{line.spread}</div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm">{line.team2}</div>
                            <div className="text-sm font-medium">
                              +
                              {line.spread.includes("-")
                                ? line.spread.replace("-", "")
                                : `-${line.spread.replace("+", "")}`}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-500">Total</div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm">Over</div>
                            <div className="text-sm font-medium">{line.total.replace("O/U ", "")}</div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm">Under</div>
                            <div className="text-sm font-medium">{line.total.replace("O/U ", "")}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ),
              )}

              {category !== "all" && bettingLines.filter((line) => line.category === category).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No betting lines available for {category}.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
