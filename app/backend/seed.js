const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: "postgresql://postgres:postgres@localhost:5432/oikos",
});

const prisma = new PrismaClient({ adapter });

async function seed() {
  const iglesia = await prisma.iglesia.create({
    data: { nombre: "Iglesia Central", direccion: "Calle 123", historia: "Fundada en 1990" },
  });
  console.log("Iglesia:", iglesia.id);

  const rol = await prisma.rol.create({
    data: { nombre: "miembro" },
  });
  console.log("Rol:", rol.id);

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
