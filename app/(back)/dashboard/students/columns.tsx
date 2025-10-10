"use client";

import { Checkbox } from "@/components/ui/checkbox";
import DateColumn from "@/components/DataTableColumns/DateColumn";
import SortableColumn from "@/components/DataTableColumns/SortableColumn";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortableColumn column={column} title="Name" />,
    cell: ({ row }) => {
      const student = row.original;
      return `${student.firstName} ${student.lastName}`;
    },
  },
  {
    accessorKey: "admissionNumber",
    header: ({ column }) => <SortableColumn column={column} title="Admission No." />,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => <SortableColumn column={column} title="Gender" />,
  },
  {
    accessorKey: "classLevel",
    header: ({ column }) => <SortableColumn column={column} title="Class" />,
  },
  {
    accessorKey: "stream",
    header: ({ column }) => <SortableColumn column={column} title="Stream" />,
  },
  {
    accessorKey: "enrolledAt",
    header: "Enrolled Date",
    cell: ({ row }) => <DateColumn row={row} accessorKey="enrolledAt" />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex gap-2">
          <ActionColumn
            row={row}
            model="student"
            editEndpoint={`/dashboard/admin/students/update/${student.id}`}
            id={student.id}
          />
          <Link href={`/dashboard/users/students/${student.id}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
        </div>
      );
    },
  },
];
