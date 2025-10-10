"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  MoreVertical,
  Eye,
  LogOut,
  Monitor,
  Smartphone,
  Tablet,
  Users,
  Activity,
  Clock,
  MapPin,
} from "lucide-react"

// Mock data for active sessions
const mockSessions = [
  {
    id: "1",
    sessionToken: "sess_abc123xyz",
    user: {
      id: "u1",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      image: "/professional-businesswoman.png",
      role: "ADMIN",
    },
    device: "Desktop",
    browser: "Chrome 120",
    os: "Windows 11",
    ipAddress: "192.168.1.100",
    location: "New York, USA",
    loginTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    lastActivity: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    expires: new Date(Date.now() + 22 * 60 * 60 * 1000), // expires in 22 hours
  },
  {
    id: "2",
    sessionToken: "sess_def456uvw",
    user: {
      id: "u2",
      name: "Michael Chen",
      email: "michael.chen@example.com",
      image: "/professional-businessman.png",
      role: "USER",
    },
    device: "Mobile",
    browser: "Safari 17",
    os: "iOS 17",
    ipAddress: "192.168.1.105",
    location: "San Francisco, USA",
    loginTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    lastActivity: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    expires: new Date(Date.now() + 23.5 * 60 * 60 * 1000),
  },
  {
    id: "3",
    sessionToken: "sess_ghi789rst",
    user: {
      id: "u3",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      image: "/professional-woman-portrait.png",
      role: "MANAGER",
    },
    device: "Tablet",
    browser: "Edge 120",
    os: "Android 14",
    ipAddress: "192.168.1.110",
    location: "Los Angeles, USA",
    loginTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    lastActivity: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
    expires: new Date(Date.now() + 20 * 60 * 60 * 1000),
  },
  {
    id: "4",
    sessionToken: "sess_jkl012opq",
    user: {
      id: "u4",
      name: "David Kim",
      email: "david.kim@example.com",
      image: "/professional-executive.png",
      role: "USER",
    },
    device: "Desktop",
    browser: "Firefox 121",
    os: "macOS 14",
    ipAddress: "192.168.1.115",
    location: "Seattle, USA",
    loginTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    lastActivity: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    expires: new Date(Date.now() + 23 * 60 * 60 * 1000),
  },
  {
    id: "5",
    sessionToken: "sess_mno345pqr",
    user: {
      id: "u2",
      name: "Michael Chen",
      email: "michael.chen@example.com",
      image: "/professional-businessman.png",
      role: "USER",
    },
    device: "Desktop",
    browser: "Chrome 120",
    os: "Windows 11",
    ipAddress: "192.168.1.120",
    location: "San Francisco, USA",
    loginTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    lastActivity: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    expires: new Date(Date.now() + 18 * 60 * 60 * 1000),
  },
]

export function ActiveSessions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sessionToTerminate, setSessionToTerminate] = useState<string | null>(null)

  // Filter sessions based on search
  const filteredSessions = mockSessions.filter(
    (session) =>
      session.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.ipAddress.includes(searchQuery) ||
      session.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.device.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate statistics
  const totalActiveSessions = mockSessions.length
  const uniqueActiveUsers = new Set(mockSessions.map((s) => s.user.id)).size
  const mobileDevices = mockSessions.filter((s) => s.device === "Mobile").length
  const desktopDevices = mockSessions.filter((s) => s.device === "Desktop").length

  const handleTerminateSession = (sessionId: string) => {
    console.log("[v0] Terminating session:", sessionId)
    setSessionToTerminate(null)
    // Add actual termination logic here
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "Mobile":
        return <Smartphone className="h-4 w-4" />
      case "Tablet":
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const formatDuration = (start: Date, end: Date) => {
    const hours = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60))
    const minutes = Math.floor(((end.getTime() - start.getTime()) % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 transition-all hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalActiveSessions}</div>
            <p className="text-xs text-muted-foreground">Currently logged in</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10 transition-all hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{uniqueActiveUsers}</div>
            <p className="text-xs text-muted-foreground">Unique users online</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10 transition-all hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desktop Sessions</CardTitle>
            <Monitor className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{desktopDevices}</div>
            <p className="text-xs text-muted-foreground">
              {((desktopDevices / totalActiveSessions) * 100).toFixed(0)}% of sessions
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-purple-500/10 transition-all hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile Sessions</CardTitle>
            <Smartphone className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{mobileDevices}</div>
            <p className="text-xs text-muted-foreground">
              {((mobileDevices / totalActiveSessions) * 100).toFixed(0)}% of sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Monitor and manage all active user sessions</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by user, email, IP, location, or device..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Device & Browser</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Login Time</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Session Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No active sessions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSessions.map((session) => (
                    <TableRow key={session.id} className="group hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-primary/20">
                            <AvatarImage src={session.user.image || "/placeholder.svg"} alt={session.user.name} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {getInitials(session.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{session.user.name}</div>
                            <div className="text-sm text-muted-foreground">{session.user.email}</div>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {session.user.role}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(session.device)}
                          <div>
                            <div className="font-medium text-sm">{session.device}</div>
                            <div className="text-xs text-muted-foreground">{session.browser}</div>
                            <div className="text-xs text-muted-foreground">{session.os}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm">{session.location}</div>
                            <div className="text-xs text-muted-foreground">{session.ipAddress}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">{formatTimeAgo(session.loginTime)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                          {formatTimeAgo(session.lastActivity)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{formatDuration(session.loginTime, new Date())}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setSessionToTerminate(session.id)}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Terminate Session
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Terminate Session Dialog */}
      <AlertDialog open={!!sessionToTerminate} onOpenChange={() => setSessionToTerminate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to terminate this session? The user will be logged out immediately and will need to
              sign in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => sessionToTerminate && handleTerminateSession(sessionToTerminate)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Terminate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
