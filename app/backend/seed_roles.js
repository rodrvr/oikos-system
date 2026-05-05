require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seed() {
  const iglesiaId = "a21b5cbb-bc30-49d3-af94-c4ef67a45ac5";

  await prisma.rol.createMany({
    data: [
      { nombre: "PASTOR" },
      { nombre: "PRESIDENTE" },
      { nombre: "ADMIN_EVENTOS" },
    ],
    skipDuplicates: true,
  });

  const rolPastor = await prisma.rol.findFirst({ where: { nombre: "PASTOR" } });
  const rolPresidente = await prisma.rol.findFirst({ where: { nombre: "PRESIDENTE" } });
  const rolMiembro = await prisma.rol.findFirst({ where: { nombre: "miembro" } });

  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.usuario.upsert({
    where: { email: "pastor@oikos.com" },
    update: {},
    create: {
      nombre: "Pastor Test",
      email: "pastor@oikos.com",
      password: hashedPassword,
      rut: "11.111.111-1",
      direccion: "Calle Pastor 1",
      telefono: "111111111",
      telefono_emergencia: "999999999",
      fecha_nacimiento: new Date("1980-01-01"),
      foto_url: "",
      iglesia_id: iglesiaId,
      rol_id: rolPastor.id,
    },
  });

  await prisma.usuario.upsert({
    where: { email: "presidente@oikos.com" },
    update: {},
    create: {
      nombre: "Presidente Test",
      email: "presidente@oikos.com",
      password: hashedPassword,
      rut: "22.222.222-2",
      direccion: "Calle Presidente 2",
      telefono: "222222222",
      telefono_emergencia: "888888888",
      fecha_nacimiento: new Date("1985-01-01"),
      foto_url: "",
      iglesia_id: iglesiaId,
      rol_id: rolPresidente.id,
    },
  });

  await prisma.usuario.upsert({
    where: { email: "miembro@oikos.com" },
    update: {},
    create: {
      nombre: "Miembro Test",
      email: "miembro@oikos.com",
      password: hashedPassword,
      rut: "33.333.333-3",
      direccion: "Calle Miembro 3",
      telefono: "333333333",
      telefono_emergencia: "777777777",
      fecha_nacimiento: new Date("1990-01-01"),
      foto_url: "",
      iglesia_id: iglesiaId,
      rol_id: rolMiembro.id,
    },
  });

  console.log("Seed completo");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
