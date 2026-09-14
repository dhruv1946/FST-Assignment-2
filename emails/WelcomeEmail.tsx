import * as React from "react"
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Button,
} from "@react-email/components"

interface WelcomeEmailProps {
  name?: string
  email?: string
}

export const WelcomeEmail = ({
  name = "Friend",
  email = "user@example.com",
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#0f172a", fontFamily: "sans-serif", color: "#f8fafc", padding: "20px" }}>
        <Container style={{ backgroundColor: "#1e293b", borderRadius: "8px", padding: "32px", maxWidth: "560px", margin: "0 auto" }}>
          <Heading style={{ color: "#38bdf8", fontSize: "24px", margin: "0 0 16px" }}>Welcome aboard, {name}! 🚀</Heading>
          <Text style={{ fontSize: "16px", lineHeight: "24px", color: "#cbd5e1" }}>
            Your account ({email}) has been successfully created and verified on the FST Assignment 2 fullstack platform.
          </Text>
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
            Access Dashboard
          </Button>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail