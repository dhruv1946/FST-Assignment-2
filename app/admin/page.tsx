import { prisma } from "@/lib/db"
import { Shield, Users, Terminal, FileText, Activity } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminPortalPage() {
  const [auditLogs, allUsers, totalOrders, totalProducts] = await Promise.all([
    prisma.auditLog.findMany({
      take: 30,
      orderBy: { timestamp: "desc" },
      include: { user: true },
    }),
    prisma.user.findMany({
      take: 12,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count(),
    prisma.product.count(),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 font-mono font-medium mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>ROLE GATE: STAFF ACCESS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100">Operations & Security Console</h1>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Direct ledger inspection • Audit events • Role enforcement
          </p>
        </div>
      </div>

      {/* Database Pipeline Workflow Banner */}
      <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-neutral-300">
            <Terminal className="w-4 h-4 text-neutral-400" />
            <span>Relational Reset & Seeding Pipeline</span>
          </div>
          <span className="text-[10px] font-mono text-neutral-500">Automated CLI Workflow</span>
        </div>
        <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800/70 font-mono text-xs text-emerald-400 flex items-center justify-between">
          <span>npm run db:pipeline</span>
          <span className="text-neutral-500 text-[10px]">resets schema + seeds 500+ records</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-400" />
            <span>Audit Trail ({auditLogs.length} recent entries)</span>
          </h2>
          <span className="text-xs font-mono text-neutral-500">Immutable ledger</span>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800/70 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800/80 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Actor</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Entity</th>
                  <th className="px-4 py-3 font-medium">Record ID</th>
                  <th className="px-4 py-3 font-medium">Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/40 text-neutral-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="px-4 py-3 text-neutral-500 text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 font-sans font-medium text-neutral-200">{log.user.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700/60">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-300">{log.entity}</td>
                    <td className="px-4 py-3 text-neutral-500 text-[11px]">
                      {log.entityId.slice(0, 10)}...
                    </td>
                    <td className="px-4 py-3 text-neutral-400 text-[10px] max-w-xs truncate">
                      {log.metadata || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Relational Accounts Sample */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
          <Users className="w-4 h-4 text-neutral-400" />
          <span>Active User Directory</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {allUsers.map((u) => (
            <div key={u.id} className="bg-neutral-900/40 border border-neutral-800/70 p-4 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-medium text-neutral-200 text-sm font-sans">{u.name}</div>
                <div className="text-xs text-neutral-500 font-mono">{u.email}</div>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                u.role === "ADMIN"
                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  : "bg-neutral-800 text-neutral-400"
              }`}>
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}