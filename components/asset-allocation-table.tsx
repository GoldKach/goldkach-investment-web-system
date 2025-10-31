"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil } from "lucide-react";
import { DeleteUserPortfolioAssetButton } from "@/components/delete-user-portfolio-asset-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type UserPortfolioAssetRow = {
  id: string;
  userPortfolioId: string;
  portfolioAssetId: string;
  userPortfolioName: string;
  portfolioName: string;
  assetSymbol: string;
  costPrice: number;
  stock: number;
  closeValue: number;
  lossGain: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type Props = {
  items: UserPortfolioAssetRow[];
  /** Base path used for View/Edit links, e.g. "/dashboard/asset-allocation" */
  basePath?: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}
function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export function AssetAllocationTable({ items, basePath = "/dashboard/asset-allocation" }: Props) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Portfolio</TableHead>
            <TableHead>Asset</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Cost Price</TableHead>
            <TableHead className="text-right">Close Value</TableHead>
            <TableHead className="text-right">Gain/Loss</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No user portfolio assets found. Add assets to user portfolios to get started.
              </TableCell>
            </TableRow>
          ) : (
            items.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div>
                    <div className="font-semibold">{row.userPortfolioName}</div>
                    <div className="text-sm text-muted-foreground">{row.portfolioName}</div>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{row.assetSymbol}</TableCell>
                <TableCell className="text-right">{formatNumber(row.stock)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.costPrice)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.closeValue)}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={row.lossGain >= 0 ? "default" : "destructive"}>
                    {row.lossGain >= 0 ? "+" : ""}
                    {formatCurrency(row.lossGain)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild title="View details">
                      <Link href={`${basePath}/${row.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild title="Edit asset allocation">
                      <Link href={`${basePath}/${row.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteUserPortfolioAssetButton
                      userPortfolioAssetId={row.id}
                      assetSymbol={row.assetSymbol}
                      userPortfolioName={row.userPortfolioName}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
