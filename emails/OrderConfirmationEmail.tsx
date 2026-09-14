import * as React from "react"
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Button,
} from "@react-email/components"

interface OrderConfirmationEmailProps {
  orderId?: string
  productName?: string
  quantity?: number
  total?: number
  customerName?: string
}

export const OrderConfirmationEmail = ({
  orderId = "ord_mock_12345",
  productName = "Sample Product",
  quantity = 1,
  total = 99.99,
  customerName = "Valued Customer",
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#0f172a", fontFamily: "sans-serif", color: "#f8fafc", padding: "20px" }}>
        <Container style={{ backgroundColor: "#1e293b", borderRadius: "8px", padding: "32px", maxWidth: "560px", margin: "0 auto" }}>
          <Heading style={{ color: "#38bdf8", fontSize: "24px", margin: "0 0 16px" }}>Order Confirmed! 🎉</Heading>
          <Text style={{ fontSize: "16px", lineHeight: "24px", color: "#cbd5e1" }}>
            Hi {customerName}, thank you for your order. We have successfully received your payment and are processing it.
          </Text>
          <Hr style={{ borderColor: "#334155", margin: "24px 0" }} />
          <Section style={{ backgroundColor: "#0f172a", borderRadius: "6px", padding: "16px" }}>
            <Text style={{ margin: "4px 0", color: "#94a3b8", fontSize: "14px" }}>Order ID: <strong style={{ color: "#f8fafc" }}>{orderId}</strong></Text>
            <Text style={{ margin: "4px 0", color: "#94a3b8", fontSize: "14px" }}>Item: <strong style={{ color: "#f8fafc" }}>{productName}</strong> (x{quantity})</Text>
            <Text style={{ margin: "4px 0", color: "#94a3b8", fontSize: "14px" }}>Total Amount: <strong style={{ color: "#4ade80" }}>${total.toFixed(2)}</strong></Text>
          </Section>
          <Hr style={{ borderColor: "#334155", margin: "24px 0" }} />
          <Button
            href="http://localhost:3000/dashboard"
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              borderRadius: "6px",
              padding: "12px 24px",
              textDecoration: "none",
              fontWeight: 600,
              display: "inline-block",
            }}
          >
            View Your Dashboard
          </Button>
          <Text style={{ fontSize: "12px", color: "#64748b", marginTop: "32px" }}>
            FST Assignment 2 • Automated Transactional Notification Pipeline
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default OrderConfirmationEmail