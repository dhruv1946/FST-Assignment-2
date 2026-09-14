import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Webhook endpoint to ingest Resend lifecycle events (delivered, bounced, opened, complained)
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const { type, data } = payload

    if (!type || !data) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 })
    }

    const emailId = data.email_id || data.id || "unknown"
    const recipient = Array.isArray(data.to) ? data.to[0] : data.to || "unknown"

    // Find any user matching the recipient or fallback to first admin
    const user = await prisma.user.findFirst({
      where: { email: recipient },
    })

    const userId = user ? user.id : (await prisma.user.findFirst())?.id || "system"

    // Log the delivery/bounce event directly into the database as an AuditLog entry
    const log = await prisma.auditLog.create({
      data: {
        userId,
        action: `RESEND_WEBHOOK_${type.toUpperCase().replace(/\./g, "_")}`,
        entity: "EmailEvent",
        entityId: emailId,
        metadata: JSON.stringify({
          eventType: type,
          recipient,
          data,
          recordedAt: new Date().toISOString(),
        }),
      },
    })

    return NextResponse.json({
      success: true,
      message: `Event ${type} logged into database`,
      logId: log.id,
    })
  } catch (error: any) {
    console.error("Resend webhook error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}