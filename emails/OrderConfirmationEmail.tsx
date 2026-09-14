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
  productName = "Studio Hardware Unit",
  quantity = 1,
  total = 149.00,
  customerName = "Valued Client",
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#0a0a0a", fontFamily: "sans-serif", color: "#ededed", padding: "24px" }}>
        <Container style={{ backgroundColor: "#171717", borderRadius: "12px", padding: "32px", maxWidth: "540px", margin: "0 auto", border: "1px solid #262626" }}>
          <Heading style={{ color: "#ffffff", fontSize: "22px", margin: "0 0 12px", letterSpacing: "-0.5px" }}>Order Confirmed</Heading>
          <Text style={{ fontSize: "14px", lineHeight: "22px", color: "#a3a3a3" }}>
            Hello {customerName}, your acquisition has been verified and registered with Aura Studio.
          </Text>
          <Hr style={{ borderColor: "#262626", margin: "20px 0" }} />
          <Section style={{ backgroundColor: "#0a0a0a", borderRadius: "8px", padding: "16px", border: "1px solid #262626" }}>
            <Text style={{ margin: "4px 0", color: "#737373", fontSize: "13px" }}>Order Reference: <strong style={{ color: "#ededed" }}>{orderId}</strong></Text>
            <Text style={{ margin: "4px 0", color: "#737373", fontSize: "13px" }}>Item: <strong style={{ color: "#ededed" }}>{productName}</strong> (x{quantity})</Text>
            <Text style={{ margin: "4px 0", color: "#737373", fontSize: "13px" }}>Total: <strong style={{ color: "#ffffff" }}>${total.toFixed(2)}</strong></Text>
          </Section>
          <Hr style={{ borderColor: "#262626", margin: "20px 0" }} />
          <Button
            href="http://localhost:3000/dashboard"
            style={{
              backgroundColor: "#ffffff",
              color: "#0a0a0a",
              borderRadius: "8px",
              padding: "10px 20px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "13px",
              display: "inline-block",
            }}
          >
            Review Orders
          </Button>
          <Text style={{ fontSize: "11px", color: "#525252", marginTop: "28px" }}>
            Aura Studio • Precision Hardware & Workstation Design
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default OrderConfirmationEmail