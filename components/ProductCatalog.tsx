"use client"

import { useState, useTransition } from "react"
import { placeOrderAction } from "@/lib/actions/order-actions"
import { Search, CheckCircle, ArrowRight, Loader2, Sparkles, Filter } from "lucide-react"

interface ProductItem {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
}

export function ProductCatalog({ initialProducts }: { initialProducts: ProductItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [orderingId, setOrderingId] = useState<string | null>(null)
  const [orderedNotice, setOrderedNotice] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const categories = ["All", ...Array.from(new Set(initialProducts.map((p) => p.category)))]

  const filteredProducts = initialProducts.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleQuickOrder = (product: ProductItem) => {
    setOrderingId(product.id)
    setOrderedNotice(null)

    startTransition(async () => {
      try {
        const res = await placeOrderAction(product.id, 1)
        if (res.success) {
          setOrderedNotice(`Order confirmed for "${product.name}". Receipt recorded in database.`)
          setTimeout(() => setOrderedNotice(null), 5000)
        }
      } catch (err: any) {
        setOrderedNotice(`Note: ${err.message || "Sign in to place verified orders"}`)
        setTimeout(() => setOrderedNotice(null), 5000)
      } finally {
        setOrderingId(null)
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {orderedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-700 text-neutral-100 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{orderedNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-y border-neutral-800/80 py-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-neutral-100 text-neutral-950 font-semibold shadow-sm"
                  : "bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900/90 border border-neutral-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.slice(0, 32).map((product) => (
          <div
            key={product.id}
            className="group relative bg-neutral-900/40 border border-neutral-800/70 hover:border-neutral-700/80 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:bg-neutral-900/70"
          >
            <div>
              {/* Product Visual Mockup Container */}
              <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-neutral-800/60 to-neutral-900/80 border border-neutral-800/40 flex items-center justify-center relative overflow-hidden mb-4 group-hover:scale-[1.01] transition-transform">
                <div className="text-neutral-600 font-mono text-3xl font-bold tracking-tighter opacity-30 select-none">
                  {product.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[10px] tracking-wider uppercase font-mono px-2 py-0.5 rounded-md bg-neutral-950/70 text-neutral-400 border border-neutral-800/60">
                    {product.category}
                  </span>
                </div>
                <div className="absolute bottom-2.5 right-2.5">
                  <span className="text-[10px] font-mono text-neutral-400 bg-neutral-950/70 px-2 py-0.5 rounded border border-neutral-800/60">
                    Stock: {product.stock}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-semibold text-neutral-100 text-sm tracking-tight line-clamp-1 group-hover:text-white transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price & Action */}
            <div className="pt-4 mt-4 border-t border-neutral-800/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400 block font-mono text-[10px]">Price</span>
                <span className="text-base font-bold text-neutral-100 font-mono">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => handleQuickOrder(product)}
                disabled={orderingId === product.id}
                className="inline-flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-medium px-3 py-1.5 rounded-lg border border-neutral-700/60 transition-all hover:border-neutral-600 disabled:opacity-50"
              >
                {orderingId === product.id ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Acquire</span>
                    <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}