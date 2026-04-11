const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const USERS = [
  { username: "admin", password: "Admin@123456" },
  { username: "zahraa_jasim", password: "Zahraa@123456" },
  { username: "mohomed_jasim", password: "Mohomed@123456" },
];

async function main() {
  for (const user of USERS) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { username: user.username },
      update: { passwordHash },
      create: {
        username: user.username,
        passwordHash,
      },
    });
  }

  console.log("Seed completed. Users:", USERS.map((u) => u.username).join(", "));
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
