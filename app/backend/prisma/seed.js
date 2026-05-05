require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log("=== CREANDO ROLES ===");
  const roles = await Promise.all([
    prisma.rol.upsert({ where: { id: "5bc5e036-cf16-4a76-ae2f-f4e169427c30" }, update: {}, create: { id: "5bc5e036-cf16-4a76-ae2f-f4e169427c30", nombre: "PASTOR" } }),
    prisma.rol.upsert({ where: { id: "b5a44a96-c390-4a5b-8084-9c84ce0f11dc" }, update: {}, create: { id: "b5a44a96-c390-4a5b-8084-9c84ce0f11dc", nombre: "PRESIDENTE" } }),
    prisma.rol.upsert({ where: { id: "8ce5822a-dca8-4a10-bbed-c7fcc220c3b6" }, update: {}, create: { id: "8ce5822a-dca8-4a10-bbed-c7fcc220c3b6", nombre: "MIEMBRO" } }),
    prisma.rol.create({ data: { nombre: "ADMIN_EVENTOS" } }).catch(() => prisma.rol.findFirst({ where: { nombre: "ADMIN_EVENTOS" } })),
  ]);
  console.log("Roles creados:", roles.length);

  console.log("=== CREANDO IGLESIAS ===");
  const churches = [
    { id: "a21b5cbb-bc30-49d3-af94-c4ef67a45ac5", nombre: "Iglesia Central", direccion: "Calle 123, Temuco", historia: "Iglesia matriz del sistema Oikos.", youtube_url: "https://www.youtube.com/embed/live_stream?channel=UCExample" },
    { nombre: "Iglesia Bautista Millaray", direccion: "Av. Millaray 1234, Temuco", historia: "Comunidad bautista fundada en la decada de 1980.", youtube_url: "https://www.youtube.com/embed/live_stream?channel=UCExample1" },
    { nombre: "Primera Iglesia Bautista de Temuco", direccion: "Manuel Bulnes 567, Temuco", historia: "Primera iglesia bautista de la ciudad, establecida en 1908.", youtube_url: "https://www.youtube.com/embed/live_stream?channel=UCExample2" },
    { nombre: "Iglesia Bautista El Redentor", direccion: "Calle Los Alamos 890, Temuco", historia: "Enfocada en la juventud y servicio comunitario desde 1995.", youtube_url: "https://www.youtube.com/embed/live_stream?channel=UCExample3" },
    { nombre: "Iglesia Bautista El Sembrador", direccion: "Pasaje Las Rosas 234, Temuco", historia: "Iglesia misionera con enfasis en plantacion de iglesias.", youtube_url: "https://www.youtube.com/embed/live_stream?channel=UCExample4" },
    { nombre: "Iglesia Bautista Gracia y Verdad", direccion: "Av. Alemania 456, Temuco", historia: "Centrada en ensenanza biblica y discipulado, fundada en 2000.", youtube_url: "https://www.youtube.com/embed/live_stream?channel=UCExample5" },
    { nombre: "Iglesia Manantial de Vida", direccion: "Calle Los Laureles 1122, Temuco", historia: "Fuerte ministerio de alabanza y adoracion.", youtube_url: "https://www.youtube.com/embed/live_stream?channel=UCExample6" },
    { nombre: "Iglesia La Ribera", direccion: "Camino a Cajon 789, Temuco", historia: "Comunidad rural bautista desde 1975.", youtube_url: "https://www.youtube.com/embed/live_stream?channel=UCExample7" },
  ];

  for (const ch of churches) {
    if (ch.id) {
      await prisma.iglesia.upsert({ where: { id: ch.id }, update: {}, create: ch });
    } else {
      const exists = await prisma.iglesia.findFirst({ where: { nombre: ch.nombre } });
      if (!exists) await prisma.iglesia.create({ data: ch });
    }
  }
  console.log("Iglesias creadas:", churches.length);

  console.log("=== CREANDO USUARIOS TESTER ===");
  const hashed = await bcrypt.hash("password123", 10);
  const iglesiaCentral = await prisma.iglesia.findFirst({ where: { nombre: "Iglesia Central" } });
  const rolPastor = await prisma.rol.findFirst({ where: { nombre: "PASTOR" } });
  const rolPresidente = await prisma.rol.findFirst({ where: { nombre: "PRESIDENTE" } });
  const rolMiembro = await prisma.rol.findFirst({ where: { nombre: "MIEMBRO" } });

  const users = [
    { id: "00f4a4b7-5434-4cee-b865-b60edc7e56e1", nombre: "Pastor Test", email: "pastor@oikos.com", password: hashed, rut: "11.111.111-1", direccion: "Calle Pastor 1", telefono: "111111111", telefono_emergencia: "999999999", fecha_nacimiento: new Date("1980-01-01"), foto_url: "", iglesia_id: iglesiaCentral.id, rol_id: rolPastor.id },
    { id: "c59b8418-79f2-4ea2-91d5-80170d11821e", nombre: "Presidente Test", email: "presidente@oikos.com", password: hashed, rut: "22.222.222-2", direccion: "Calle Presidente 2", telefono: "222222222", telefono_emergencia: "888888888", fecha_nacimiento: new Date("1985-01-01"), foto_url: "", iglesia_id: iglesiaCentral.id, rol_id: rolPresidente.id },
    { id: "c0a8cd5a-77a3-4e5d-b815-d2c5769b33fb", nombre: "Miembro Test", email: "miembro@oikos.com", password: hashed, rut: "33.333.333-3", direccion: "Calle Miembro 3", telefono: "333333333", telefono_emergencia: "777777777", fecha_nacimiento: new Date("1990-01-01"), foto_url: "", iglesia_id: iglesiaCentral.id, rol_id: rolMiembro.id },
  ];

  for (const u of users) {
    await prisma.usuario.upsert({ where: { id: u.id }, update: {}, create: u });
  }
  console.log("Usuarios creados:", users.length);

  console.log("=== SEED COMPLETO ===");
  console.log("Credenciales: pastor@oikos.com / password123");
  console.log("Iglesias:", churches.map(c => c.nombre).join(", "));

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});
