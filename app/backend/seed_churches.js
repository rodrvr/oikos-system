require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const churches = [
  { nombre: "Iglesia Bautista Millaray", direccion: "Av. Millaray 1234, Temuco", historia: "Comunidad bautista fundada en la decada de 1980, sirviendo al sector Millaray.", youtube_url: "https://www.youtube.com/embed/live_stream?channel=UCExample1" },
  { nombre: "Primera Iglesia Bautista de Temuco", direccion: "Manuel Bulnes 567, Temuco", historia: "La primera iglesia bautista de la ciudad, establecida en 1908. Pilar historico de la fe bautista en la region.", youtube_url: "https://www.youtube.com/embed/live_stream?channel=UCExample2" },
  { nombre: "Iglesia Bautista El Redentor", direccion: "Calle Los Alamos 890, Temuco", historia: "Congregacion enfocada en la juventud y el servicio comunitario desde 1995.", youtube_url: "https://www.youtube.com/embed/live_stream?channel=UCExample3" },
  { nombre: "Iglesia Bautista El Sembrador", direccion: "Pasaje Las Rosas 234, Temuco", historia: "Iglesia misionera con fuerte enfasis en la plantacion de nuevas iglesias en la region.", youtube_url: "https://www.youtube.com/embed/live_stream?channel=UCExample4" },
  { nombre: "Iglesia Bautista Gracia y Verdad", direccion: "Av. Alemania 456, Temuco", historia: "Comunidad centrada en la ensenanza biblica y el discipulado, fundada en el 2000.", youtube_url: "https://www.youtube.com/embed/live_stream?channel=UCExample5" },
  { nombre: "Iglesia Manantial de Vida", direccion: "Calle Los Laureles 1122, Temuco", historia: "Iglesia carismatica bautista con un fuerte ministerio de alabanza y adoracion.", youtube_url: "https://www.youtube.com/embed/live_stream?channel=UCExample6" },
  { nombre: "Iglesia La Ribera", direccion: "Camino a Cajon 789, Temuco", historia: "Comunidad rural bautista sirviendo a las familias del sector La Ribera desde 1975.", youtube_url: "https://www.youtube.com/embed/live_stream?channel=UCExample7" },
];

async function seed() {
  for (const church of churches) {
    const exists = await prisma.iglesia.findFirst({ where: { nombre: church.nombre } });
    if (!exists) {
      await prisma.iglesia.create({ data: church });
      console.log("Creada:", church.nombre);
    } else {
      console.log("Ya existe:", church.nombre);
    }
  }
  await prisma.$disconnect();
}

seed().catch((e) => { console.error(e.message); process.exit(1); });
