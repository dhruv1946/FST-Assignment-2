import { prisma } from "@/lib/db"
import { Shield, Users, Terminal, FileText, Database } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminPortalPage() {
  // Fetch telemetry and recent audit logs
  const [auditLogs, allUsers, totalOrders, totalProducts] = await Promise.all([
    prisma.auditLog.findMany({
      take: 25,
      orderBy: { timestamp: "desc" },
      include: { user: true },
    }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count(),
    prisma.product.count(),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Role-Based Access Control Gate: ADMIN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">System Administration & Audit Log</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time security auditing, relational database telemetry, and transactional event inspection.
          </p>
        </div>
      </div>

      {/* CLI Pipeline Workflow Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span>Automated CLI Workflow Command</span>
        </h3>
        <p className="text-xs text-slate-400">
          Reset database schema, apply Prisma migrations, and execute Faker.js relational seeding in a single command:
        </p>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 flex items-center justify-between">
          <span>npm run db:pipeline</span>
          <span className="text-slate-500 text-[10px]">resets + migrates + seeds 500+ records</span>
        </div>
      </div>

      {/* System Audit Logs Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <span>Immutable Security Audit Trail ({auditLogs.length} recent)</span>
          </h2>
          <span className="text-xs text-slate-500">Auto-logged on mutations, auth, & webhook events</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Timestamp</th>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                  <th className="px-4 py-3 font-semibold">Entity</th>
                  <th className="px-4 py-3 font-semibold">Entity ID</th>
                  <th className="px-4 py-3 font-semibold">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">{log.user.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{log.entity}</td>
                    <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">
                      {log.entityId.slice(0, 10)}...
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400 text-[10px] max-w-xs truncate">
                      {log.metadata || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Relational Users Sample */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-sky-400" />
          <span>Active Users & Roles (Seeded Sample)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {allUsers.map((u) => (
            <div key={u.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-medium text-white text-sm">{u.name}</div>
                <div className="text-xs text-slate-400">{u.email}</div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                u.role === "ADMIN"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-slate-800 text-slate-400"
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