import React from "react";
import { columns } from "./columns";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";

export default async function page() {
   const mockParents = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+256701234567",
      address: "Kampala, Uganda",
      occupation: "Engineer",
      relationship: "Father",
      children: ["s1", "s2"],
      createdAt: new Date("2024-01-10T09:00:00Z"),
      updatedAt: new Date("2025-06-20T14:00:00Z"),
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Nakamya",
      email: "jane.nakamya@example.com",
      phone: "+256773456789",
      address: "Entebbe, Uganda",
      occupation: "Nurse",
      relationship: "Mother",
      children: ["s3"],
      createdAt: new Date("2024-03-18T11:30:00Z"),
      updatedAt: new Date("2025-06-25T10:30:00Z"),
    },
    {
      id: "3",
      firstName: "Robert",
      lastName: "Okello",
      email: "robert.okello@example.com",
      phone: "+256754321678",
      address: "Gulu, Uganda",
      occupation: "Businessman",
      relationship: "Guardian",
      children: ["s4"],
      createdAt: new Date("2023-11-05T15:00:00Z"),
      updatedAt: new Date("2025-05-22T09:00:00Z"),
    },
    {
      id: "4",
      firstName: "Susan",
      lastName: "Kato",
      email: "susan.kato@example.com",
      phone: "+256790987654",
      address: "Mbarara, Uganda",
      occupation: "Teacher",
      relationship: "Mother",
      children: ["s5", "s6"],
      createdAt: new Date("2024-06-12T08:45:00Z"),
      updatedAt: new Date("2025-06-10T07:00:00Z"),
    },
  ];
  
  return (
    <div className="p-8">
      <TableHeader
        title="Parents"
        linkTitle="Add Parent"
        href="/dashboard/admin/parents/new"
        data={mockParents}
        model="parent"
      />
      <div className="py-8">
        <DataTable data={mockParents} columns={columns} />
      </div>
    </div>
  );
}