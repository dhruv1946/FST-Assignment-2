"use client"

import Link from "next/link"
import { useSession, signOut } from "@/lib/auth-client"
import { Shield, ShoppingBag, User as UserIcon, LogOut, LogIn, LayoutDashboard } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()
  const user = session?.user as (Record<string, any> & { name?: string; email?: string; role?: string }) | undefined

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-sky-400 font-bold text-lg tracking-tight hover:opacity-90">
          <ShoppingBag className="w-5 h-5" />
          <span>FST Nexus <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">Assignment 2</span></span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">Catalog</Link>
          <Link href="/dashboard" className="flex items-center gap-1 hover:text-white transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin" className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors">
            <Shield className="w-4 h-4" />
            <span>Admin Portal</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-slate-800 px-2.5 py-1 rounded-full text-slate-300 border border-slate-700">
                <UserIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>{user.name}</span>
                {user.role === "ADMIN" && (
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded font-semibold">ADMIN</span>
                )}
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-md transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/sign-in"
                className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-md transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/auth/sign-up"
                className="text-xs bg-sky-600 hover:bg-sky-500 text-white font-medium px-3 py-1.5 rounded-md transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}