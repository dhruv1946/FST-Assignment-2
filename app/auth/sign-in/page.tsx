"use client"

import { useState } from "react"
import { signIn } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogIn, ArrowRight } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@aurastudio.dev")
  const [password, setPassword] = useState("password123")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await signIn.email({
        email,
        password,
      })

      if (res.error) {
        setError(res.error.message || "Failed to sign in")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto my-16 bg-neutral-900/60 border border-neutral-800/80 p-8 rounded-3xl shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-neutral-800/80 text-neutral-200 mb-1 border border-neutral-700/60">
          <LogIn className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-100">Sign in to Aura</h1>
        <p className="text-xs text-neutral-400 font-mono">
          Demo staff: <code className="text-neutral-200">admin@aurastudio.dev</code>
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600 transition-colors font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-600 transition-colors font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-neutral-100 hover:bg-white disabled:opacity-50 text-neutral-950 font-semibold py-2.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
        >
          <span>{loading ? "Authenticating..." : "Continue"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <div className="text-center text-xs text-neutral-500">
        New to Aura?{" "}
        <Link href="/auth/sign-up" className="text-neutral-300 hover:text-white underline underline-offset-4">
          Create account
        </Link>
      </div>
    </div>
  )
}