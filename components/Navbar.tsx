"use client"

import Link from "next/link"
import { useSession, signOut } from "@/lib/auth-client"
import { Shield, User as UserIcon, LogOut, LogIn, Package } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()
  const user = session?.user as (Record<string, any> & { name?: string; email?: string; role?: string }) | undefined

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neutral-200 to-neutral-500 flex items-center justify-center text-neutral-950 font-bold text-xs tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
              AU
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-widest uppercase text-neutral-100 font-mono">AURA</span>
              <span className="text-[9px] text-neutral-400 -mt-1 tracking-wider uppercase">Studio Hardware</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs tracking-wider uppercase text-neutral-400 font-medium">
            <Link href="/" className="hover:text-neutral-100 transition-colors">Catalog</Link>
            <Link href="/dashboard" className="hover:text-neutral-100 transition-colors flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              <span>Orders</span>
            </Link>
            <Link href="/admin" className="hover:text-neutral-100 transition-colors flex items-center gap-1.5 text-neutral-400 hover:text-amber-300">
              <Shield className="w-3.5 h-3.5" />
              <span>Operations</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 text-xs bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full text-neutral-300 hover:border-neutral-700 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                <span className="max-w-[120px] truncate">{user.name || user.email}</span>
                {user.role === "ADMIN" && (
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">STAFF</span>
                )}
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 px-3 py-1.5 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/sign-in"
                className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-neutral-100 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 px-3.5 py-1.5 rounded-lg transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/auth/sign-up"
                className="text-xs bg-neutral-100 hover:bg-white text-neutral-950 font-semibold px-3.5 py-1.5 rounded-lg transition-all shadow-sm"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}