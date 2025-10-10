// "use client";

// import { Checkbox } from "@/components/ui/checkbox";

// import DateColumn from "@/components/DataTableColumns/DateColumn";
// import ImageColumn from "@/components/DataTableColumns/ImageColumn";
// import SortableColumn from "@/components/DataTableColumns/SortableColumn";
// import { ColumnDef } from "@tanstack/react-table";
// import ActionColumn from "@/components/DataTableColumns/ActionColumn";
// export const columns: ColumnDef<any>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "name",
//     header: ({ column }) => <SortableColumn column={column} title="Name" />,
//   },
//   {
//     accessorKey: "region.name",
//     header: ({ column }) => <SortableColumn column={column} title="Region" />,
//   },
//   {
//     accessorKey: "areas.length",
//     header: ({ column }) => <SortableColumn column={column} title="Area" />,
//   },
//   {
//     accessorKey: "parkingLots.length",
//     header: ({ column }) => <SortableColumn column={column} title="Parking Lots" />,
//   },
//   {
//     accessorKey: "createdAt",
//     header: "Date Created",
//     cell: ({ row }) => <DateColumn row={row} accessorKey="createdAt" />,
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const parent = row.original;
//       return (
//         <ActionColumn
//           row={row}
//           model="parent"
//           editEndpoint={`parents/update/${parent.id}`}
//           id={parent.id}
//         />
//       );
//     },
//   },
// ];

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
      const parent = row.original;
      return `${parent.firstName} ${parent.lastName}`;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableColumn column={column} title="Email" />,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <SortableColumn column={column} title="Phone" />,
  },
  {
    accessorKey: "occupation",
    header: ({ column }) => <SortableColumn column={column} title="Occupation" />,
  },
  {
    accessorKey: "relationship",
    header: ({ column }) => <SortableColumn column={column} title="Relationship" />,
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => <DateColumn row={row} accessorKey="createdAt" />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const parent = row.original;
      return (
        <div className="flex gap-2">
          <ActionColumn
            row={row}
            model="parent"
            editEndpoint={`/dashboard/admin/parents/update/${parent.id}`}
            id={parent.id}
          />
          <Link href={`/dashboard/users/parents/${parent.id}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
        </div>
      );
    },
  },
];
