import { Resend } from "resend"
import { OrderConfirmationEmail } from "@/emails/OrderConfirmationEmail"
import { WelcomeEmail } from "@/emails/WelcomeEmail"
import { prisma } from "./db"

export const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key")

export async function sendOrderConfirmationNotification(params: {
  userId: string
  to: string
  customerName: string
  orderId: string
  productName: string
  quantity: number
  total: number
}) {
  try {
    let emailId = `mock_email_${Date.now()}`
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_placeholder_key") {
      const { data } = await resend.emails.send({
        from: "Aura Studio <notifications@resend.dev>",
        to: params.to,
        subject: `Order Confirmation #${params.orderId}`,
        react: OrderConfirmationEmail({
          orderId: params.orderId,
          productName: params.productName,
          quantity: params.quantity,
          total: params.total,
          customerName: params.customerName,
        }),
      })
      if (data?.id) emailId = data.id
    }

    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: "EMAIL_DISPATCHED",
        entity: "Order",
        entityId: params.orderId,
        metadata: JSON.stringify({
          recipient: params.to,
          type: "ORDER_CONFIRMATION",
          emailId,
          timestamp: new Date().toISOString(),
        }),
      },
    })

    return { success: true, emailId }
  } catch (error: any) {
    console.error("Failed to send order email:", error)
    return { success: false, error: error.message }
  }
}

export async function sendWelcomeNotification(params: {
  userId: string
  to: string
  name: string
}) {
  try {
    let emailId = `mock_welcome_${Date.now()}`
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_placeholder_key") {
      const { data } = await resend.emails.send({
        from: "Aura Studio <notifications@resend.dev>",
        to: params.to,
        subject: "Welcome to Aura Studio",
        react: WelcomeEmail({ name: params.name, email: params.to }),
      })
      if (data?.id) emailId = data.id
    }

    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: "EMAIL_DISPATCHED",
        entity: "User",
        entityId: params.userId,
        metadata: JSON.stringify({
          recipient: params.to,
          type: "WELCOME_EMAIL",
          emailId,
        }),
      },
    })

    return { success: true, emailId }
  } catch (error: any) {
    console.error("Failed to send welcome email:", error)
    return { success: false, error: error.message }
  }
}