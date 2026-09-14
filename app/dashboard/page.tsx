import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Package, Clock, CheckCircle2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // If not logged in, display demo view with first seeded user
  const user = session?.user || (await prisma.user.findFirst({ where: { role: "USER" } }))

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Fetch orders belonging to this user
  const userOrders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Member Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Signed in as <span className="text-sky-400 font-semibold">{user.name}</span> ({user.email})
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Session Verified via Better Auth</span>
        </div>
      </div>

      {/* Orders Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-sky-400" />
          <span>Your Transactional Order History ({userOrders.length})</span>
        </h2>

        {userOrders.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
            No orders placed yet. Explore the catalog on the homepage!
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Order ID</th>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Qty</th>
                    <th className="px-4 py-3 font-semibold">Total</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {userOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">{order.id.slice(0, 10)}...</td>
                      <td className="px-4 py-3 font-medium text-white">{order.product.name}</td>
                      <td className="px-4 py-3">{order.quantity}</td>
                      <td className="px-4 py-3 text-emerald-400 font-semibold">${order.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
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