import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"

const prisma = new PrismaClient()

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Automotive",
  "Health & Beauty",
]

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]

async function main() {
  console.log("🌱 Starting seed...")

  // ── Clean existing data ──────────────────────────────────────────────────
  await prisma.auditLog.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verification.deleteMany()
  await prisma.user.deleteMany()
  console.log("✅ Cleaned existing data")

  // ── Create 1 admin + 49 regular users (50 total) ───────────────────────
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@fst-assignment.dev",
      emailVerified: true,
      role: "ADMIN",
    },
  })

  const regularUsers = await Promise.all(
    Array.from({ length: 49 }, () =>
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          emailVerified: faker.datatype.boolean(0.7),
          role: "USER",
          image: faker.image.avatar(),
        },
      })
    )
  )

  const allUsers = [adminUser, ...regularUsers]
  console.log(`✅ Created ${allUsers.length} users (1 admin + 49 regular)`)

  // ── Create 100 products ───────────────────────────────────────────────
  const products = await Promise.all(
    Array.from({ length: 100 }, () =>
      prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price({ min: 5, max: 999 })),
          stock: faker.number.int({ min: 0, max: 500 }),
          category: faker.helpers.arrayElement(CATEGORIES),
          createdById: adminUser.id,
        },
      })
    )
  )
  console.log(`✅ Created ${products.length} products`)

  // ── Create 200 orders ─────────────────────────────────────────────────
  const orders = await Promise.all(
    Array.from({ length: 200 }, () => {
      const user = faker.helpers.arrayElement(allUsers)
      const product = faker.helpers.arrayElement(products)
      const quantity = faker.number.int({ min: 1, max: 10 })
      const total = parseFloat((product.price * quantity).toFixed(2))
      return prisma.order.create({
        data: {
          userId: user.id,
          productId: product.id,
          quantity,
          total,
          status: faker.helpers.arrayElement(ORDER_STATUSES),
          createdAt: faker.date.past({ years: 1 }),
        },
      })
    })
  )
  console.log(`✅ Created ${orders.length} orders`)

  // ── Create audit log entries ──────────────────────────────────────────
  const auditActions = [
    { action: "CREATE_PRODUCT", entity: "Product" },
    { action: "PLACE_ORDER", entity: "Order" },
    { action: "UPDATE_ORDER_STATUS", entity: "Order" },
    { action: "LOGIN", entity: "User" },
    { action: "LOGOUT", entity: "User" },
  ]

  await Promise.all(
    Array.from({ length: 150 }, () => {
      const user = faker.helpers.arrayElement(allUsers)
      const auditAction = faker.helpers.arrayElement(auditActions)
      const entityId =
        auditAction.entity === "Product"
          ? faker.helpers.arrayElement(products).id
          : auditAction.entity === "Order"
          ? faker.helpers.arrayElement(orders).id
          : user.id

      return prisma.auditLog.create({
        data: {
          userId: user.id,
          action: auditAction.action,
          entity: auditAction.entity,
          entityId,
          metadata: JSON.stringify({ ip: faker.internet.ip(), userAgent: faker.internet.userAgent() }),
          timestamp: faker.date.past({ years: 1 }),
        },
      })
    })
  )
  console.log("✅ Created 150 audit log entries")

  console.log("\n🎉 Seed complete!")
  console.log(`   Admin credentials: admin@fst-assignment.dev`)
  console.log(`   Total users: ${allUsers.length}`)
  console.log(`   Total products: ${products.length}`)
  console.log(`   Total orders: ${orders.length}`)
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })