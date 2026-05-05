require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function check() {
  const user = await prisma.usuario.findUnique({ where: { email: "test@oikos.com" }, select: { password: true } });
  console.log("Password hash:", user.password.substring(0, 10) + "...");
  console.log("Is bcrypt:", user.password.startsWith("$2b$") || user.password.startsWith("$2a$"));
  await prisma.$disconnect();
}

check();
