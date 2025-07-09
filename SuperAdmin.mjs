/*
Admin creation script - creates both SUPERADMIN and GUEST admin users
Usage: node SuperAdmin.mjs
*/

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    // Create super admin with plain text password (will be hashed by NextAuth)
    const admin = await prisma.admin.create({
      data: {
        email: "learncrypt2@gmail.com",
        name: "The.King",
        password: "Learncrypt296", // This will be hashed by NextAuth on first login
        role: "SUPERADMIN",
      },
    });

    console.log("✅ SUPERADMIN created successfully:");
    console.log("📧 Email:", admin.email);
    console.log("👤 Name:", admin.name);
    console.log("🔑 Role:", admin.role);
    console.log("🔐 Password: Learncrypt296");

  } catch (error) {
    if (error.code === 'P2002') {
      console.log("⚠️  SUPERADMIN with this email already exists");
    } else {
      console.error("❌ Error creating SUPERADMIN:", error.message);
    }
  }
}

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

  } catch (error) {
    if (error.code === 'P2002') {
      console.log("⚠️  GUEST ADMIN with this email already exists");
    } else {
      console.error("❌ Error creating GUEST ADMIN:", error.message);
    }
  }
}

async function createAdmins() {
  console.log("🚀 Creating admin users...\n");

  await createSuperAdmin();
  console.log("");
  await createGuestAdmin();

  console.log("\n🎉 Admin creation process completed!");
  console.log("🚀 You can now login to the dashboard with either account!");
}

createAdmins()
  .catch((e) => console.error("❌ Script error:", e))
  .finally(async () => await prisma.$disconnect());
