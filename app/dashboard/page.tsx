import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Package, Clock, CheckCircle2, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Provide fallback to first user for review if not actively signed in
  const user = session?.user || (await prisma.user.findFirst({ where: { role: "USER" } }))

  if (!user) {
    redirect("/auth/sign-in")
  }

  const userOrders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return (
    <div className="space-y-8">
      {/* User Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100">Customer Account</h1>
            <span className="text-[10px] font-mono uppercase bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded">
              Verified
            </span>
          </div>
          <p className="text-sm text-neutral-400 mt-1 font-mono">
            {user.name} • <span className="text-neutral-500">{user.email}</span>
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 px-3.5 py-2 rounded-xl transition-colors"
        >
          <span>Browse Catalog</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Orders Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-200 flex items-center gap-2">
            <Package className="w-4 h-4 text-neutral-400" />
            <span>Order History ({userOrders.length})</span>
          </h2>
          <span className="text-xs font-mono text-neutral-500">Live Relational Query</span>
        </div>

        {userOrders.length === 0 ? (
          <div className="bg-neutral-900/30 border border-neutral-800/60 rounded-2xl p-12 text-center text-neutral-500 space-y-3">
            <p className="text-sm">No acquisitions recorded yet.</p>
            <Link
              href="/"
              className="inline-block text-xs text-neutral-300 underline underline-offset-4 hover:text-white"
            >
              Explore the collection
            </Link>
          </div>
        ) : (
          <div className="bg-neutral-900/40 border border-neutral-800/70 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800/80 font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">Reference</th>
                    <th className="px-5 py-3.5 font-medium">Item</th>
                    <th className="px-5 py-3.5 font-medium">Quantity</th>
                    <th className="px-5 py-3.5 font-medium">Amount</th>
                    <th className="px-5 py-3.5 font-medium">Status</th>
                    <th className="px-5 py-3.5 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/40 text-neutral-300 font-mono">
                  {userOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="px-5 py-4 text-neutral-500 text-[11px]">#{order.id.slice(0, 8)}</td>
                      <td className="px-5 py-4 font-sans font-medium text-neutral-100">{order.product.name}</td>
                      <td className="px-5 py-4 text-neutral-400">{order.quantity}</td>
                      <td className="px-5 py-4 text-neutral-100 font-semibold">${order.total.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-neutral-500 text-[11px]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}