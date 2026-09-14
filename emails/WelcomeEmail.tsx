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
      <Body style={{ backgroundColor: "#0a0a0a", fontFamily: "sans-serif", color: "#ededed", padding: "24px" }}>
        <Container style={{ backgroundColor: "#171717", borderRadius: "12px", padding: "32px", maxWidth: "540px", margin: "0 auto", border: "1px solid #262626" }}>
          <Heading style={{ color: "#ffffff", fontSize: "22px", margin: "0 0 12px", letterSpacing: "-0.5px" }}>Welcome to Aura Studio</Heading>
          <Text style={{ fontSize: "14px", lineHeight: "22px", color: "#a3a3a3" }}>
            Hello {name}, your membership profile ({email}) is now active.
          </Text>
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
            Visit Studio
          </Button>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail