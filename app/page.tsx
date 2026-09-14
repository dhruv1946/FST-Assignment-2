import { prisma } from "@/lib/db"
import Link from "next/link"
import { Database, Users, ShoppingCart, Activity, ShieldCheck, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  // Aggregate real-time metrics from the seeded Prisma database
  const [userCount, productCount, orderCount, auditLogCount, recentProducts] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.auditLog.count(),
    prisma.product.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ])

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 p-8 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Assignment 2 Backend & Service Pipeline</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Automated Relational Seeding & Secure Endpoints
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Engineered with <strong className="text-slate-200">Prisma ORM</strong>, multi-entity relational schema,
            <strong className="text-slate-200"> Faker.js</strong> automated seeding, <strong className="text-slate-200">Better Auth RBAC</strong>, and <strong className="text-slate-200">Resend</strong> transactional lifecycle notifications.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-medium px-5 py-2.5 rounded-lg shadow-lg shadow-sky-600/20 transition-all text-sm"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-5 py-2.5 rounded-lg border border-slate-700 transition-all text-sm"
            >
              <span>Inspect Admin & Audit Logs</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Database Seeding Metrics */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
            <Database className="w-5 h-5 text-sky-400" />
            <span>Live Database Telemetry (Seeded via Faker.js)</span>
          </h2>
          <span className="text-xs text-slate-400">Target Schema: Users • Products • Orders • AuditLogs</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Total Users</span>
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-3xl font-bold text-white">{userCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">1 Admin + 49 Relational Users</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Catalog Items</span>
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white">{productCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Normalized Across 8 Categories</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Orders Tracked</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white">{orderCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Multi-item relational transactions</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Audit Logs</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">{auditLogCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Immutable security event records</p>
          </div>
        </div>
      </section>

      {/* Featured Products Catalog */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-200">Catalog Preview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentProducts.map((product) => (
            <div key={product.id} className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors p-5 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40 uppercase">
                  {product.category}
                </span>
                <h3 className="font-semibold text-white mt-2 text-base line-clamp-1">{product.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.description}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-lg font-bold text-emerald-400">${product.price.toFixed(2)}</span>
                <span className="text-xs text-slate-500">Stock: {product.stock}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}