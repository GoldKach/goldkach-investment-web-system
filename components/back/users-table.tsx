"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, MoreVertical, Eye, Edit, Trash2, UserCheck, UserX, Mail, Phone, CreditCard } from "lucide-react"


export function UsersTable({allUsers}:{allUsers:any}) {
  const [users, setUsers] = useState(allUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user:any) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery),
  )

  const handleDelete = (userId: string) => {
    setSelectedUserId(userId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedUserId) {
      setUsers(users.filter((user:any) => user.id !== selectedUserId))
      setDeleteDialogOpen(false)
      setSelectedUserId(null)
    }
  }

  const handleView = (userId: string) => {
    console.log("[v0] Viewing user:", userId)
    // Navigate to user detail page
  }

  const handleEdit = (userId: string) => {
    console.log("[v0] Editing user:", userId)
    // Navigate to edit user page
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map((user:any) => (user.id === userId ? { ...user, isActive: !user.isActive } : user)))
  }

  return (
    <div className="space-y-4">
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Management</CardTitle>
          <CardDescription>Manage all users on the investment platform</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, account number, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="pb-2">
                <CardDescription>Total Users</CardDescription>
                <CardTitle className="text-3xl font-bold text-primary">{users.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10">
              <CardHeader className="pb-2">
                <CardDescription>Active Users</CardDescription>
                <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {users.filter((u:any) => u.isActive).length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-orange-500/10">
              <CardHeader className="pb-2">
                <CardDescription>Pending Approval</CardDescription>
                <CardTitle className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {users.filter((u:any) => !u.isApproved).length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-red-500/10">
              <CardHeader className="pb-2">
                <CardDescription>Inactive Users</CardDescription>
                <CardTitle className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {users.filter((u:any) => !u.isActive).length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Users Table */}
          <div className="rounded-lg border border-border/50">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Phone</TableHead>
                  <TableHead className="font-semibold">Account Number</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <UserX className="mb-2 h-8 w-8" />
                        <p>No users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user:any) => (
                    <TableRow key={user.id} className="group transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-primary/20">
                            <AvatarImage src={user.imageUrl || undefined} alt={user.name} />
                            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{user.email}</span>
                          {user.emailVerified && (
                            <Badge
                              variant="outline"
                              className="border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"
                            >
                              Verified
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{user.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{user.accountNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={user.isActive ? "default" : "secondary"}
                            className={
                              user.isActive
                                ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400"
                                : "bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400"
                            }
                          >
                            {user.isActive ? (
                              <>
                                <UserCheck className="mr-1 h-3 w-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <UserX className="mr-1 h-3 w-3" />
                                Inactive
                              </>
                            )}
                          </Badge>
                          {!user.isApproved && (
                            <Badge
                              variant="outline"
                              className="border-orange-500/50 bg-orange-500/10 text-orange-600 dark:text-orange-400"
                            >
                              Pending
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                     
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleView(user.id)} className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(user.id)} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleUserStatus(user.id)} className="cursor-pointer">
                              {user.isActive ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(user.id)}
                              className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and remove all associated data
              from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
