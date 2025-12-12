




"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MoreVertical, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteUser } from "@/actions/auth";

type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED" | "DEACTIVATED" | "BANNED";

interface User {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  imageUrl?: string;
  status: UserStatus;
  emailVerified: boolean;
  wallet?: {
    accountNumber: string;
  };
}

interface UsersTableProps {
  allUsers: User[];
}

export function UsersTable({ allUsers }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(allUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Helper function to get display name
  const displayName = (user: User): string => {
    return user.name || [user.firstName, user.lastName].filter(Boolean).join(" ") || "Unknown User";
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const name = displayName(user).toLowerCase();
    const email = (user.email ?? "").toLowerCase();
    const accountNumber = (user.wallet?.accountNumber ?? "").toLowerCase();
    const phone = user.phone ?? "";

    return (
      name.includes(query) ||
      email.includes(query) ||
      accountNumber.includes(query) ||
      phone.includes(query)
    );
  });

  // Status badge styling
  const statusClass: Record<UserStatus, string> = {
    ACTIVE: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    INACTIVE: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
    PENDING: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    SUSPENDED: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    DEACTIVATED: "bg-muted text-muted-foreground border-muted",
    BANNED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  // Handle delete user
  const handleDelete = (userId: string) => {
    setSelectedUserId(userId);
    setDeleteDialogOpen(true);
  };

  // Confirm delete user
  const confirmDelete = async () => {
    if (!selectedUserId) return;

    setIsDeleting(true);

    try {
      const result = await deleteUser(selectedUserId);

      if (result.success) {
        // Remove from local state
        setUsers((list) => list.filter((user) => user.id !== selectedUserId));
        toast.success(result.message || "User deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedUserId(null);
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while deleting the user");
    } finally {
      setIsDeleting(false);
    }
  };

  // Navigation handlers
  const handleView = (userId: string) => router.push(`/dashboard/users/${userId}`);
  const handleEdit = (userId: string) => router.push(`/dashboard/users/${userId}/edit`);

  // Calculate statistics
  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "ACTIVE").length,
    pending: users.filter((u) => u.status === "PENDING").length,
    inactive: users.filter((u) => u.status === "INACTIVE" || u.status === "DEACTIVATED").length,
  };

  // Get user initials for avatar
  const getUserInitials = (user: User): string => {
    const firstName = user.firstName?.[0] || displayName(user)?.[0] || "";
    const lastName = user.lastName?.[0] || "";
    return (firstName + lastName).toUpperCase();
  };

  // Get selected user for delete dialog
  const selectedUser = users.find((u) => u.id === selectedUserId);

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

          {/* Statistics Cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Total Users</CardDescription>
                <CardTitle className="text-3xl font-bold text-primary">{stats.total}</CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Active Users</CardDescription>
                <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats.active}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-orange-500/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Pending</CardDescription>
                <CardTitle className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.pending}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-zinc-500/20 bg-gradient-to-br from-zinc-500/5 to-zinc-500/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Inactive</CardDescription>
                <CardTitle className="text-3xl font-bold text-zinc-700 dark:text-zinc-300">
                  {stats.inactive}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Users Table */}
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">User</TableHead>
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
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      {searchQuery ? "No users found matching your search" : "No users found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="group transition-colors hover:bg-muted/50"
                    >
                      {/* User Info */}
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-primary/20">
                            <AvatarImage src={user.imageUrl} alt={displayName(user)} />
                            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                              {getUserInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{displayName(user)}</div>
                            <div className="text-xs text-muted-foreground">ID: {user.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm">{user.email}</span>
                          {user.emailVerified && (
                            <Badge
                              variant="outline"
                              className="w-fit border-green-500/50 bg-green-500/10 text-xs text-green-600"
                            >
                              Verified
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Phone */}
                      <TableCell>
                        <span className="text-sm">{user.phone || "—"}</span>
                      </TableCell>

                      {/* Account Number */}
                      <TableCell>
                        <span className="font-mono text-sm">
                          {user.wallet?.accountNumber || "—"}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusClass[user.status] || "bg-muted text-muted-foreground"}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => handleView(user.id)}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleEdit(user.id)}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
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
            <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to permanently delete the account for{" "}
              <span className="font-semibold text-foreground">
                {selectedUser ? displayName(selectedUser) : "this user"}
              </span>
              . This action cannot be undone and will remove:
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>User profile and personal information</li>
                <li>Account balance and transaction history</li>
                <li>All associated portfolios and investments</li>
                <li>Activity logs and preferences</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Permanently"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}