import { Search, Bell, Settings, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/sidebar"

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-yellow-300 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-black"></div>
          <span className="font-bold">LOGO</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full bg-white">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full bg-white">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full bg-white">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full bg-white">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold mb-2">Overview</h1>
          <p className="text-gray-600 mb-6">
            This is the high-level view of your team's productivity. It includes a summary of today's activity, as well
            as a 7-day trend.
          </p>

          {/* Productivity Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Productivity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-gray-500 mb-1">Items processed</div>
                    <div className="text-3xl font-bold">0</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-gray-500 mb-1">Worker present</div>
                    <div className="text-3xl font-bold">0</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-gray-500 mb-1">
                      Target <span className="ml-2">55</span>
                    </div>
                    <div className="text-3xl font-bold">61</div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="text-sm mb-4">Item yang diproses 7 hari terakhir</div>
                  <div className="h-64">
                    <BarChart />
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Productivity Trends */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Productivity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-gray-500 mb-1">Avg. per Day</div>
                    <div className="text-3xl font-bold">61</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-gray-500 mb-1">Avg. per Week</div>
                    <div className="text-3xl font-bold">58</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-gray-500 mb-1">Avg. per Month</div>
                    <div className="text-3xl font-bold">61</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Productivity Details */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Productivity Details</CardTitle>
              <Button variant="ghost" className="text-green-600">
                Lihat Semua
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-4 font-normal text-gray-500">Tanggal</th>
                      <th className="pb-4 font-normal text-gray-500">Binning</th>
                      <th className="pb-4 font-normal text-gray-500">Picking</th>
                      <th className="pb-4 font-normal text-gray-500">Total Workers</th>
                      <th className="pb-4 font-normal text-gray-500">Worker Presents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array(8)
                      .fill(0)
                      .map((_, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-4">01/04/2025</td>
                          <td className="py-4">66</td>
                          <td className="py-4">{index === 0 ? "29" : index === 1 ? "45" : "47"}</td>
                          <td className="py-4">8</td>
                          <td className="py-4">6</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

function BarChart() {
  const days = ["Jul 18", "Jul 19", "Jul 20", "Jul 21", "Jul 22", "Jul 23", "Jul 24"]

  return (
    <div className="relative h-full w-full">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
        <div>100</div>
        <div>80</div>
        <div>60</div>
        <div>40</div>
        <div>20</div>
        <div>0</div>
      </div>

      {/* Chart area */}
      <div className="absolute left-10 right-0 top-0 bottom-0">
        {/* Target line */}
        <div className="absolute top-[60%] left-0 right-0 border-t border-red-400"></div>

        {/* Bars */}
        <div className="h-full flex items-end justify-between">
          {days.map((day, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 bg-blue-500 h-[85%]"></div>
              <div className="mt-2 text-xs">{day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
