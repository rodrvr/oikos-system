require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seed() {
  await prisma.iglesia.updateMany({
    where: { youtube_url: null },
    data: { youtube_url: "https://www.youtube.com/embed/live_stream?channel=UCEazyMbvJdGqQV6HekgHJxg" },
  });
  console.log("Youtube URL actualizada");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
