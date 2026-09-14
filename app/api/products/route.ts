import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { z } from "zod"

const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  category: z.string().min(1, "Category is required"),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100)
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1)
    const skip = (page - 1) * limit

    const where: any = {}
    if (category) where.category = category
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
        include: { createdBy: { select: { id: true, name: true, email: true } } },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createProductSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, description, price, stock, category } = parsed.data

    // Database transaction: Create Product + Record Audit Log
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          description,
          price,
          stock,
          category,
          createdById: session.user.id,
        },
      })

      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: "CREATE_PRODUCT",
          entity: "Product",
          entityId: product.id,
          metadata: JSON.stringify({ price, stock, category }),
        },
      })

      return product
    })

    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}