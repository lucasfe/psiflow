import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { InvoiceStatus } from "@/generated/prisma/enums";
import Link from "next/link";

const statusVariant: Record<InvoiceStatus, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "outline",
  SENT: "default",
  PAID: "secondary",
  OVERDUE: "destructive",
  CANCELLED: "destructive",
};

export default async function BillingPage() {
  const invoices = await db.invoice.findMany({
    orderBy: { issuedAt: "desc" },
    take: 50,
    include: {
      patient: { select: { firstName: true, lastName: true } },
      items: { select: { quantity: true, unitPrice: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-sm text-muted-foreground">Recent 50 invoices</p>
        </div>
        <Link
          href="/billing/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          New Invoice
        </Link>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Invoice</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Patient</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Issued</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Due</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No invoices yet.
                </td>
              </tr>
            )}
            {invoices.map((invoice) => {
              const total = invoice.items.reduce(
                (sum, item) => sum + item.quantity * Number(item.unitPrice),
                0
              );
              return (
                <tr key={invoice.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/billing/${invoice.id}`} className="font-mono text-xs hover:underline">
                      {invoice.id.slice(0, 8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {invoice.patient.firstName} {invoice.patient.lastName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {invoice.issuedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {invoice.dueAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    ${total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[invoice.status]}>
                      {invoice.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
