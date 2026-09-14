import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { z } from "zod"

const createOrderSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role || "USER"
    const where = userRole === "ADMIN" ? {} : { userId: session.user.id }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        product: true,
        user: { select: { id: true, name: true, email: true } },
      },
      take: 100,
    })

    return NextResponse.json({ success: true, data: orders })
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
    const parsed = createOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { productId, quantity } = parsed.data

    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    if (product.stock < quantity) {
      return NextResponse.json({ success: false, error: "Insufficient stock available" }, { status: 400 })
    }

    const total = parseFloat((product.price * quantity).toFixed(2))

    // Atomic transaction: Deduct stock + Create Order + Log Audit
    const order = await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } },
      })

      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          productId,
          quantity,
          total,
          status: "CONFIRMED",
        },
        include: { product: true },
      })

      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: "PLACE_ORDER",
          entity: "Order",
          entityId: newOrder.id,
          metadata: JSON.stringify({ quantity, total, productName: product.name }),
        },
      })

      return newOrder
    })

    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}