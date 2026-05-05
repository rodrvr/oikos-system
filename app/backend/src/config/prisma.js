const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "postgresql://USER:PASSWORD@localhost:5432/oikos",
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
