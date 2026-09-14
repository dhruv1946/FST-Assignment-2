import { prisma } from "@/lib/db"
import { ProductCatalog } from "@/components/ProductCatalog"
import { ArrowRight, Sparkles, Activity, ShieldCheck, Database, Layers } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [userCount, productCount, orderCount, auditCount, products] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.auditLog.count(),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 60,
    }),
  ])

  return (
    <div className="space-y-14">
      {/* Editorial Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900/80 to-neutral-950 border border-neutral-800/80 p-8 sm:p-14 shadow-2xl">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-neutral-800/60 text-neutral-300 border border-neutral-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Studio Series • Catalog 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-50 leading-[1.1]">
            Objects designed for quiet focus and longevity.
          </h1>

          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
            A curated suite of tactile workstation hardware, acoustic modules, and archival tools.
            Engineered with durable materials and structured relational precision.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="#catalog"
              className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-white text-neutral-950 font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-sm"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800/90 text-neutral-300 hover:text-white font-medium px-5 py-3 rounded-xl border border-neutral-800 text-sm transition-all"
            >
              <span>View Your Orders</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="catalog" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-100">
              Curated Equipment
            </h2>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              Displaying {products.length} registered catalog items
            </p>
          </div>
        </div>

        <ProductCatalog initialProducts={products} />
      </section>

      {/* Discrete Infrastructure Health Panel */}
      <section className="rounded-2xl bg-neutral-900/30 border border-neutral-800/60 p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-800/60 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400">
            <Layers className="w-4 h-4 text-neutral-400" />
            <span>Core Data Architecture & Telemetry</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>All Systems Nominal</span>
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-neutral-950/60 border border-neutral-800/50 p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Registered Accounts</span>
            <div className="text-2xl font-bold font-mono text-neutral-100 mt-1">{userCount}</div>
            <span className="text-[10px] text-neutral-400">Auth Sessions Active</span>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/50 p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Active Inventory</span>
            <div className="text-2xl font-bold font-mono text-neutral-100 mt-1">{productCount}</div>
            <span className="text-[10px] text-neutral-400">Normalized Units</span>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/50 p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Transactions</span>
            <div className="text-2xl font-bold font-mono text-neutral-100 mt-1">{orderCount}</div>
            <span className="text-[10px] text-neutral-400">Orders Processed</span>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/50 p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Security Events</span>
            <div className="text-2xl font-bold font-mono text-neutral-100 mt-1">{auditCount}</div>
            <span className="text-[10px] text-neutral-400">Immutable Audit Logs</span>
          </div>
        </div>
      </section>
    </div>
  )
}