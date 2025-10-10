"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Users,
  Home,
  Trophy,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Download,
  Edit,
  Bell,
  Star,
} from "lucide-react"
import Link from "next/link"

// Mock student data
const studentData = {
  id: "STU-2024-001",
  firstName: "Emma",
  lastName: "Johnson",
  fullName: "Emma Johnson",
  avatar: "/placeholder.svg?height=120&width=120",
  dateOfBirth: "2008-03-15",
  gender: "Female",
  bloodGroup: "O+",
  religion: "Christian",
  nationality: "American",
  address: "123 Oak Street, Springfield, IL 62701",
  phone: "+1 (555) 123-4567",
  email: "emma.johnson@student.school.edu",
  admissionDate: "2020-08-15",
  studentId: "2024001",

  // Academic Info
  currentClass: "Grade 10",
  section: "A",
  stream: "Science",
  rollNumber: "15",
  house: "Phoenix House",
  academicYear: "2024-2025",

  // Parents Info
  parents: [
    {
      type: "Father",
      name: "Michael Johnson",
      occupation: "Software Engineer",
      phone: "+1 (555) 987-6543",
      email: "michael.johnson@email.com",
      address: "123 Oak Street, Springfield, IL 62701",
    },
    {
      type: "Mother",
      name: "Sarah Johnson",
      occupation: "Teacher",
      phone: "+1 (555) 456-7890",
      email: "sarah.johnson@email.com",
      address: "123 Oak Street, Springfield, IL 62701",
    },
  ],

  // Subjects
  subjects: [
    { name: "Mathematics", teacher: "Dr. Smith", code: "MATH101" },
    { name: "Physics", teacher: "Prof. Wilson", code: "PHY101" },
    { name: "Chemistry", teacher: "Dr. Brown", code: "CHEM101" },
    { name: "Biology", teacher: "Ms. Davis", code: "BIO101" },
    { name: "English", teacher: "Mr. Taylor", code: "ENG101" },
    { name: "History", teacher: "Ms. Anderson", code: "HIST101" },
  ],

  // Academic Results
  results: [
    {
      term: "Term 1 - 2024",
      subjects: [
        { name: "Mathematics", marks: 92, grade: "A+", remarks: "Excellent" },
        { name: "Physics", marks: 88, grade: "A", remarks: "Very Good" },
        { name: "Chemistry", marks: 85, grade: "A", remarks: "Good" },
        { name: "Biology", marks: 90, grade: "A+", remarks: "Excellent" },
        { name: "English", marks: 87, grade: "A", remarks: "Very Good" },
        { name: "History", marks: 83, grade: "B+", remarks: "Good" },
      ],
      overall: { percentage: 87.5, grade: "A", rank: 3, totalStudents: 45 },
    },
    {
      term: "Term 2 - 2024",
      subjects: [
        { name: "Mathematics", marks: 95, grade: "A+", remarks: "Outstanding" },
        { name: "Physics", marks: 91, grade: "A+", remarks: "Excellent" },
        { name: "Chemistry", marks: 89, grade: "A", remarks: "Very Good" },
        { name: "Biology", marks: 93, grade: "A+", remarks: "Excellent" },
        { name: "English", marks: 90, grade: "A+", remarks: "Excellent" },
        { name: "History", marks: 86, grade: "A", remarks: "Very Good" },
      ],
      overall: { percentage: 90.7, grade: "A+", rank: 2, totalStudents: 45 },
    },
  ],

  // Fee Information
  feeStructure: {
    totalAnnualFee: 12000,
    paidAmount: 8000,
    pendingAmount: 4000,
    dueDate: "2024-12-31",
  },

  feeHistory: [
    { date: "2024-08-15", description: "Admission Fee", amount: 2000, status: "Paid", method: "Bank Transfer" },
    { date: "2024-09-01", description: "Tuition Fee - Term 1", amount: 3000, status: "Paid", method: "Online Payment" },
    { date: "2024-10-01", description: "Activity Fee", amount: 500, status: "Paid", method: "Cash" },
    { date: "2024-11-01", description: "Lab Fee", amount: 800, status: "Paid", method: "Cheque" },
    { date: "2024-12-01", description: "Tuition Fee - Term 2", amount: 3000, status: "Pending", method: "-" },
    { date: "2024-12-15", description: "Transport Fee", amount: 1000, status: "Pending", method: "-" },
  ],

  // Attendance
  attendance: {
    totalDays: 180,
    presentDays: 172,
    absentDays: 8,
    percentage: 95.6,
  },

  // Clubs and Activities
  clubs: [
    { name: "Science Club", role: "Member", joinDate: "2023-09-01" },
    { name: "Drama Society", role: "Vice President", joinDate: "2022-10-15" },
    { name: "Environmental Club", role: "Member", joinDate: "2024-01-10" },
  ],

  // Achievements
  achievements: [
    { title: "Science Fair Winner", date: "2024-03-15", category: "Academic" },
    { title: "Best Actor Award", date: "2023-12-10", category: "Extra-curricular" },
    { title: "Environmental Champion", date: "2024-04-22", category: "Social Service" },
  ],
}

export default function StudentDetailPage() {
  const feePercentagePaid = (studentData.feeStructure.paidAmount / studentData.feeStructure.totalAnnualFee) * 100

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Link href="/students" className="text-purple-600 hover:text-purple-800 transition-colors">
                ← Back to Students
              </Link>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:border-purple-300 bg-transparent">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:border-purple-300 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Bell className="h-4 w-4 mr-2" />
                Send Notice
              </Button>
            </div>
          </div>
        </div>

        {/* Student Profile Header */}
        <Card className="mb-6 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24 border-4 border-purple-100">
                <AvatarImage src={studentData.avatar || "/placeholder.svg"} alt={studentData.fullName} />
                <AvatarFallback className="text-2xl bg-purple-100 text-purple-600">
                  {studentData.firstName[0]}
                  {studentData.lastName[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{studentData.fullName}</h1>
                    <p className="text-lg text-gray-600">Student ID: {studentData.studentId}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                      {studentData.currentClass} - {studentData.section}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">{studentData.stream} Stream</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Home className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">{studentData.house}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Roll: {studentData.rollNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">{studentData.attendance.percentage}% Attendance</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-purple-50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="academic" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Academic
            </TabsTrigger>
            <TabsTrigger value="fees" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Fees
            </TabsTrigger>
            <TabsTrigger value="parents" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Parents
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Activities
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-purple-600" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date of Birth:</span>
                    <span className="text-sm font-medium">
                      {new Date(studentData.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gender:</span>
                    <span className="text-sm font-medium">{studentData.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Blood Group:</span>
                    <span className="text-sm font-medium">{studentData.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Religion:</span>
                    <span className="text-sm font-medium">{studentData.religion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Nationality:</span>
                    <span className="text-sm font-medium">{studentData.nationality}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-purple-600" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-sm font-medium">{studentData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-sm font-medium">{studentData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="text-sm font-medium">{studentData.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {studentData.results[studentData.results.length - 1]?.overall.percentage}%
                    </div>
                    <p className="text-sm text-gray-600">Latest Term Average</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{studentData.attendance.percentage}%</div>
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      #{studentData.results[studentData.results.length - 1]?.overall.rank}
                    </div>
                    <p className="text-sm text-gray-600">Class Rank</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Achievements */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-purple-600" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {studentData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-sm">{achievement.title}</p>
                        <p className="text-xs text-gray-600">{new Date(achievement.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic Tab */}
          <TabsContent value="academic" className="space-y-6">
            {/* Current Subjects */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <span>Current Subjects</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentData.subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-sm text-gray-600">{subject.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{subject.teacher}</p>
                        <p className="text-xs text-gray-500">Teacher</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Academic Results */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span>Academic Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={studentData.results[0]?.term} className="space-y-4">
                  <TabsList className="bg-purple-50">
                    {studentData.results.map((result, index) => (
                      <TabsTrigger
                        key={index}
                        value={result.term}
                        className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                      >
                        {result.term}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {studentData.results.map((result, termIndex) => (
                    <TabsContent key={termIndex} value={result.term}>
                      <div className="space-y-4">
                        {/* Overall Performance */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-purple-50 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{result.overall.percentage}%</div>
                            <p className="text-sm text-gray-600">Overall</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{result.overall.grade}</div>
                            <p className="text-sm text-gray-600">Grade</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">#{result.overall.rank}</div>
                            <p className="text-sm text-gray-600">Rank</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-600">{result.overall.totalStudents}</div>
                            <p className="text-sm text-gray-600">Total Students</p>
                          </div>
                        </div>

                        {/* Subject-wise Results */}
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Subject</TableHead>
                              <TableHead className="text-center">Marks</TableHead>
                              <TableHead className="text-center">Grade</TableHead>
                              <TableHead>Remarks</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.subjects.map((subject, index) => (
                              <TableRow key={index} className="hover:bg-purple-50">
                                <TableCell className="font-medium">{subject.name}</TableCell>
                                <TableCell className="text-center">
                                  <Badge
                                    variant={
                                      subject.marks >= 90 ? "default" : subject.marks >= 80 ? "secondary" : "outline"
                                    }
                                  >
                                    {subject.marks}/100
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge
                                    className={`${
                                      subject.grade.includes("A+")
                                        ? "bg-green-100 text-green-800"
                                        : subject.grade.includes("A")
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {subject.grade}
                                  </Badge>
                                </TableCell>
                                <TableCell>{subject.remarks}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Attendance */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span>Attendance Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{studentData.attendance.presentDays}</div>
                    <p className="text-sm text-gray-600">Present Days</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{studentData.attendance.absentDays}</div>
                    <p className="text-sm text-gray-600">Absent Days</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{studentData.attendance.totalDays}</div>
                    <p className="text-sm text-gray-600">Total Days</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{studentData.attendance.percentage}%</div>
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Attendance Progress</span>
                    <span>{studentData.attendance.percentage}%</span>
                  </div>
                  <Progress value={studentData.attendance.percentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fees Tab */}
          <TabsContent value="fees" className="space-y-6">
            {/* Fee Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span>Total Annual Fee</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    ${studentData.feeStructure.totalAnnualFee.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Amount Paid</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    ${studentData.feeStructure.paidAmount.toLocaleString()}
                  </div>
                  <Progress value={feePercentagePaid} className="mt-2 h-2" />
                  <p className="text-sm text-gray-600 mt-1">{feePercentagePaid.toFixed(1)}% paid</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span>Pending Amount</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    ${studentData.feeStructure.pendingAmount.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Due: {new Date(studentData.feeStructure.dueDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Fee History */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span>Fee Payment History</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentData.feeHistory.map((fee, index) => (
                      <TableRow key={index} className="hover:bg-purple-50">
                        <TableCell>{new Date(fee.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{fee.description}</TableCell>
                        <TableCell className="text-right font-medium">${fee.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={fee.status === "Paid" ? "default" : "destructive"}
                            className={fee.status === "Paid" ? "bg-green-100 text-green-800" : ""}
                          >
                            {fee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{fee.method}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Parents Tab */}
          <TabsContent value="parents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentData.parents.map((parent, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span>{parent.type}'s Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium">{parent.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Occupation</p>
                      <p className="font-medium">{parent.occupation}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{parent.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{parent.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">{parent.address}</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Contact {parent.type}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            {/* Clubs and Societies */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Clubs & Societies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {studentData.clubs.map((club, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-purple-50 transition-colors">
                      <h4 className="font-medium">{club.name}</h4>
                      <p className="text-sm text-purple-600 font-medium">{club.role}</p>
                      <p className="text-xs text-gray-600">Joined: {new Date(club.joinDate).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-purple-600" />
                  <span>Achievements & Awards</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentData.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">
                          {achievement.category} • {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Generate Reports</CardTitle>
                  <CardDescription>Download comprehensive student reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Academic Progress Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Attendance Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Fee Statement
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Achievement Certificate
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                    <Bell className="h-4 w-4 mr-2" />
                    Send Notice to Parents
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update Student Information
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Parent Meeting
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Add Disciplinary Note
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
