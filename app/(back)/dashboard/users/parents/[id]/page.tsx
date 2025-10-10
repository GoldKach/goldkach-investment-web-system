import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Mail, MapPin, Phone, Plus, Edit, User, Briefcase, Heart, Globe, Users } from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual data fetching
const mockParent = {
  id: "parent123",
  firstName: "John",
  lastName: "Smith",
  phone: "+1234567890",
  email: "john.smith@email.com",
  idNo: "ID123456789",
  village: "Downtown",
  dob: new Date("1985-06-15"),
  altNo: "+1987654321",
  occupation: "Software Engineer",
  address: "123 Main Street, City Center",
  imageUrl: "/placeholder.svg?height=100&width=100",
  title: "Mr.",
  relationship: "Father",
  contactMethod: "Email",
  gender: "Male",
  country: "United States",
  religion: "Christianity",
  createdAt: new Date("2023-01-15"),
  updatedAt: new Date("2024-01-10"),
  students: [
    {
      id: "student1",
      firstName: "Emma",
      lastName: "Smith",
      grade: "Grade 8",
      class: "8A",
      studentId: "STU001",
      status: "Active",
    },
    {
      id: "student2",
      firstName: "James",
      lastName: "Smith",
      grade: "Grade 5",
      class: "5B",
      studentId: "STU002",
      status: "Active",
    },
  ],
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function ParentDetailPage({ params }: Props) {
  const { id } = await params

  // In a real app, fetch parent data using the id
  const parent = mockParent

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={parent.imageUrl || "/placeholder.svg"} alt={`${parent.firstName} ${parent.lastName}`} />
            <AvatarFallback className="text-lg">{getInitials(parent.firstName, parent.lastName)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">
              {parent.title} {parent.firstName} {parent.lastName}
            </h1>
            <p className="text-muted-foreground text-lg">{parent.relationship}</p>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>
                  {parent.students.length} Student{parent.students.length !== 1 ? "s" : ""}
                </span>
              </Badge>
              <Badge variant="outline">ID: {parent.idNo}</Badge>
            </div>
          </div>
        </div>
        <Button asChild>
          <Link href={`/parents/${parent.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Parent
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="font-medium">
                    {parent.title} {parent.firstName} {parent.lastName}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Gender</label>
                  <p>{parent.gender}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                  <p className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(parent.dob)}</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">ID Number</label>
                  <p>{parent.idNo}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                  <p className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{parent.occupation}</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Religion</label>
                  <p className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>{parent.religion}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Primary Phone</label>
                  <p className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{parent.phone}</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Alternative Phone</label>
                  <p className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{parent.altNo || "Not provided"}</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{parent.email}</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Preferred Contact</label>
                  <Badge variant="outline">{parent.contactMethod}</Badge>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{parent.address}</span>
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Village/Area</label>
                  <p>{parent.village}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Country</label>
                  <p className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{parent.country}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Students</span>
                  </CardTitle>
                  <CardDescription>Children registered under this parent</CardDescription>
                </div>
                <Button size="sm" asChild>
                  <Link href={`/students/register?parentId=${parent.id}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {parent.students.length > 0 ? (
                <div className="space-y-4">
                  {parent.students.map((student) => (
                    <div key={student.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">
                          {student.firstName} {student.lastName}
                        </h4>
                        <Badge variant={student.status === "Active" ? "default" : "secondary"}>{student.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Student ID: {student.studentId}</p>
                        <p>Grade: {student.grade}</p>
                        <p>Class: {student.class}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                        <Link href={`/students/${student.id}`}>View Details</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No students registered yet</p>
                  <Button asChild>
                    <Link href={`/students/register?parentId=${parent.id}`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Register First Student
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                <p className="text-sm">{formatDate(parent.createdAt)}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-sm">{formatDate(parent.updatedAt)}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Relationship</label>
                <Badge variant="outline">{parent.relationship}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
