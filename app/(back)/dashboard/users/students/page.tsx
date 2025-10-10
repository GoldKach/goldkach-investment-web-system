import React from "react";
import { columns } from "./columns";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";

export default async function page() {
  const mockStudents = [
    {
      id: "s1",
      firstName: "Isaac",
      lastName: "Mukasa",
      gender: "Male",
      dateOfBirth: "2010-04-15",
      classLevel: "Primary 5",
      stream: "North",
      admissionNumber: "ADM001",
      parentId: "1",
      address: "Kampala, Uganda",
      enrolledAt: new Date("2020-02-10T09:00:00Z"),
      updatedAt: new Date("2025-06-25T12:00:00Z"),
    },
    {
      id: "s2",
      firstName: "Lydia",
      lastName: "Doe",
      gender: "Female",
      dateOfBirth: "2012-07-23",
      classLevel: "Primary 3",
      stream: "East",
      admissionNumber: "ADM002",
      parentId: "1",
      address: "Kampala, Uganda",
      enrolledAt: new Date("2021-01-20T08:00:00Z"),
      updatedAt: new Date("2025-06-25T11:30:00Z"),
    },
    {
      id: "s3",
      firstName: "Michael",
      lastName: "Nakamya",
      gender: "Male",
      dateOfBirth: "2011-09-12",
      classLevel: "Primary 4",
      stream: "South",
      admissionNumber: "ADM003",
      parentId: "2",
      address: "Entebbe, Uganda",
      enrolledAt: new Date("2020-09-15T10:00:00Z"),
      updatedAt: new Date("2025-06-20T14:45:00Z"),
    },
    {
      id: "s4",
      firstName: "Faith",
      lastName: "Okello",
      gender: "Female",
      dateOfBirth: "2009-02-27",
      classLevel: "Primary 6",
      stream: "West",
      admissionNumber: "ADM004",
      parentId: "3",
      address: "Gulu, Uganda",
      enrolledAt: new Date("2019-06-10T11:00:00Z"),
      updatedAt: new Date("2025-06-22T09:30:00Z"),
    },
    {
      id: "s5",
      firstName: "Brian",
      lastName: "Kato",
      gender: "Male",
      dateOfBirth: "2013-01-10",
      classLevel: "Primary 2",
      stream: "North",
      admissionNumber: "ADM005",
      parentId: "4",
      address: "Mbarara, Uganda",
      enrolledAt: new Date("2022-02-14T07:30:00Z"),
      updatedAt: new Date("2025-06-15T08:00:00Z"),
    },
    {
      id: "s6",
      firstName: "Agnes",
      lastName: "Kato",
      gender: "Female",
      dateOfBirth: "2014-05-08",
      classLevel: "Primary 1",
      stream: "East",
      admissionNumber: "ADM006",
      parentId: "4",
      address: "Mbarara, Uganda",
      enrolledAt: new Date("2023-03-05T09:00:00Z"),
      updatedAt: new Date("2025-06-18T10:00:00Z"),
    },
  ];

  return (
    <div className="p-8">
      <TableHeader
        title="Students"
        linkTitle="Add Student"
        href="/dashboard/users/students/new"
        data={mockStudents}
        model="student"
      />
      <div className="py-8">
        <DataTable data={mockStudents} columns={columns} />
      </div>
    </div>
  );
}
