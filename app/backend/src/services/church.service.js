const prisma = require("../config/prisma");

class ChurchService {
  async getAll() {
    const churches = await prisma.iglesia.findMany({
      select: {
        id: true,
        nombre: true,
        direccion: true,
        historia: true,
        youtube_url: true,
      },
    });
    return churches;
  }

  async getById(id) {
    const church = await prisma.iglesia.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        direccion: true,
        historia: true,
        youtube_url: true,
      },
    });
    if (!church) {
      throw new Error("Iglesia no encontrada");
    }
    return church;
  }

  async getMyChurch(iglesiaId) {
    const church = await prisma.iglesia.findUnique({
      where: { id: iglesiaId },
      select: {
        id: true,
        nombre: true,
        direccion: true,
        historia: true,
        youtube_url: true,
      },
    });
    if (!church) {
      throw new Error("Iglesia no encontrada");
    }
    return church;
  }
}

module.exports = new ChurchService();
