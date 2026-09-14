"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export async function placeOrderAction(productId: string, quantity: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || !session.user) {
    throw new Error("Authentication required")
  }

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) throw new Error("Product not found")
  if (product.stock < quantity) throw new Error("Out of stock")

  const total = parseFloat((product.price * quantity).toFixed(2))

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

  revalidatePath("/dashboard")
  revalidatePath("/admin")
  return { success: true, order }
}