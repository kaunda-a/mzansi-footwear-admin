/*
Guest Admin creation script
Usage: node GuestAdmin.mjs
*/

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createGuestAdmin() {
  try {
    // Create guest admin with plain text password (will be hashed by NextAuth)
    const admin = await prisma.admin.create({
      data: {
        email: "guest1212@gmail.com",
        name: "Guest Admin",
        password: "guest1212", // This will be hashed by NextAuth on first login
        role: "GUEST",
      },
    });

    console.log("✅ GUEST ADMIN created successfully:");
    console.log("📧 Email:", admin.email);
    console.log("👤 Name:", admin.name);
    console.log("🔑 Role:", admin.role);
    console.log("🔐 Password: guest1212");
    console.log("\n🚀 You can now login to the dashboard!");

  } catch (error) {
    if (error.code === 'P2002') {
      console.log("⚠️  GUEST ADMIN with this email already exists");
    } else {
      console.error("❌ Error creating GUEST ADMIN:", error.message);
    }
  }
}

createGuestAdmin()
  .catch((e) => console.error("❌ Script error:", e))
  .finally(async () => await prisma.$disconnect());
