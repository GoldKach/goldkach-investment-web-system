"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Server,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Info,
  CalendarIcon,
  Filter,
  X,
  Trash2,
  AlertTriangle,
  Monitor,
  Smartphone,
  Globe,
  Settings,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  getSystemLogs,
  getModulesList,
  getActivityDetail,
  deleteOldLogs,
  ActivityLog,
  Pagination,
  ModuleItem,
  SystemLogStats,
} from "@/actions/history";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function SystemLogsPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [stats, setStats] = useState<SystemLogStats | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [errorOnly, setErrorOnly] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [page, setPage] = useState(1);

  // Detail modal
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  // Cleanup
  const [cleanupDays, setCleanupDays] = useState("90");
  const [cleaning, setCleaning] = useState(false);

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    fetchSystemLogs();
  }, [page, moduleFilter, methodFilter, platformFilter, errorOnly, startDate, endDate]);

  const fetchModules = async () => {
    const result = await getModulesList();
    if (result.success && result.data) {
      setModules(result.data);
    }
  };

  const fetchSystemLogs = async () => {
    setLoading(true);
    const params: any = { page, limit: 100 };
    if (moduleFilter !== "all") params.module = moduleFilter;
    if (methodFilter !== "all") params.method = methodFilter;
    if (platformFilter !== "all") params.platform = platformFilter;
    if (errorOnly) params.errorOnly = "true";
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    if (search) params.search = search;

    const result = await getSystemLogs(params);
    if (result.success && result.data) {
      setLogs(result.data);
      setPagination(result.pagination || null);
      setStats(result.stats || null);
    } else {
      toast.error(result.error || "Failed to load system logs");
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setPage(1);
    fetchSystemLogs();
  };

  const handleViewDetail = async (id: string) => {
    const result = await getActivityDetail(id);
    if (result.success && result.data) {
      setSelectedLog(result.data);
    } else {
      toast.error(result.error || "Failed to load log detail");
    }
  };

  const handleCleanup = async () => {
    setCleaning(true);
    const result = await deleteOldLogs(parseInt(cleanupDays));
    if (result.success) {
      toast.success(result.message || `Deleted ${result.deletedCount} old logs`);
      fetchSystemLogs();
    } else {
      toast.error(result.error || "Failed to cleanup logs");
    }
    setCleaning(false);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            OK
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return <Badge variant="outline">{status || "-"}</Badge>;
    }
  };

  const getMethodBadge = (method?: string) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-100 text-blue-700",
      POST: "bg-green-100 text-green-700",
      PUT: "bg-yellow-100 text-yellow-700",
      PATCH: "bg-orange-100 text-orange-700",
      DELETE: "bg-red-100 text-red-700",
    };
    return (
      <Badge className={cn(colors[method || ""] || "bg-gray-100 text-gray-700", "hover:bg-opacity-100")}>
        {method || "-"}
      </Badge>
    );
  };

  const getPlatformIcon = (platform?: string) => {
    switch (platform?.toLowerCase()) {
      case "web":
        return <Monitor className="h-4 w-4" />;
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "api":
        return <Globe className="h-4 w-4" />;
      default:
        return <Terminal className="h-4 w-4" />;
    }
  };

  const clearFilters = () => {
    setModuleFilter("all");
    setMethodFilter("all");
    setPlatformFilter("all");
    setErrorOnly(false);
    setStartDate(undefined);
    setEndDate(undefined);
    setSearch("");
    setPage(1);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Server className="h-8 w-8" />
            System Logs
          </h1>
          <p className="text-muted-foreground">
            Detailed technical logs and system events (Super Admin only)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchSystemLogs} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Cleanup
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cleanup Old Logs</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete logs older than the specified number of days.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <Label htmlFor="cleanupDays">Delete logs older than (days)</Label>
                <Select value={cleanupDays} onValueChange={setCleanupDays}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">365 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCleanup}
                  disabled={cleaning}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {cleaning ? "Deleting..." : "Delete Old Logs"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Total Count */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total?.toLocaleString()}</div>
            </CardContent>
          </Card>

          {/* By Module Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">By Module</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.byModule?.slice(0, 6) || []}
                      dataKey="count"
                      nameKey="module"
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                    >
                      {stats.byModule?.slice(0, 6).map((_:any, index:any) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* By Platform Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">By Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.byPlatform || []} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="platform" width={60} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-7">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {modules.map((m) => (
                  <SelectItem key={m.module} value={m.module}>
                    {m.module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="api">API</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PP") : "Start"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PP") : "End"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="error-only"
                  checked={errorOnly}
                  onCheckedChange={setErrorOnly}
                />
                <Label htmlFor="error-only" className="text-sm text-muted-foreground">
                  Show errors only
                </Label>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-1 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
            <Button size="sm" onClick={handleSearch}>
              <Filter className="mr-1 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Log Entries</CardTitle>
          <CardDescription>
            Showing {logs.length} of {pagination?.total || 0} entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : logs.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow
                        key={log.id}
                        className={cn(
                          log.status === "FAILED" && "bg-red-50 hover:bg-red-100"
                        )}
                      >
                        <TableCell className="font-mono text-xs">
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {log.action}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {log.module || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell>{getMethodBadge(log.method)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getPlatformIcon(log.platform)}
                            <span className="text-xs">{log.platform || "-"}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                        <TableCell className="text-xs">
                          {log.user?.email || "-"}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.ipAddress || "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(log.id)}
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No logs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Log Detail
            </DialogTitle>
            <DialogDescription>
              Complete technical information about this log entry
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              {/* Status Banner */}
              {selectedLog.status === "FAILED" && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Error Occurred</p>
                    <p className="text-sm text-red-700">
                      {selectedLog.errorMessage || "Unknown error"}
                    </p>
                  </div>
                </div>
              )}

              {/* Main Info Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Action</p>
                  <p className="font-medium">{selectedLog.action}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Module</p>
                  <p className="font-medium">{selectedLog.module || "-"}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Status</p>
                  {getStatusBadge(selectedLog.status)}
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Method</p>
                  {getMethodBadge(selectedLog.method)}
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Platform</p>
                  <div className="flex items-center gap-1">
                    {getPlatformIcon(selectedLog.platform)}
                    <span>{selectedLog.platform || "-"}</span>
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {selectedLog.durationMs ? `${selectedLog.durationMs}ms` : "-"}
                  </p>
                </div>
              </div>

              {/* User Info */}
              {selectedLog.user && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">User</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{selectedLog.user.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedLog.user.email}</p>
                    </div>
                    <Badge>{selectedLog.user.role}</Badge>
                  </div>
                </div>
              )}

              {/* Technical Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">IP Address</p>
                  <p className="font-mono text-sm">{selectedLog.ipAddress || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm">{selectedLog.location || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Entity Type</p>
                  <p className="text-sm">{selectedLog.entityType || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Entity ID</p>
                  <p className="font-mono text-sm">{selectedLog.entityId || "-"}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{selectedLog.description || "-"}</p>
              </div>

              {/* User Agent */}
              {selectedLog.userAgent && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">User Agent</p>
                  <p className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                    {selectedLog.userAgent}
                  </p>
                </div>
              )}

              {/* Referrer URL */}
              {selectedLog.referrerUrl && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Referrer URL</p>
                  <p className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                    {selectedLog.referrerUrl}
                  </p>
                </div>
              )}

              {/* Metadata */}
              {selectedLog.metadata && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Metadata</p>
                  <pre className="p-3 bg-muted rounded-lg text-xs overflow-auto max-h-[200px]">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}

              {/* Timestamp */}
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Logged at: {new Date(selectedLog.createdAt).toLocaleString()}
                </p>
                {selectedLog.isAutomated && (
                  <Badge variant="outline" className="mt-1">
                    <Settings className="h-3 w-3 mr-1" />
                    Automated
                  </Badge>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}