const prisma = require("../config/prisma");

class NewsService {
  async getAll() {
    const news = await prisma.noticia.findMany({
      orderBy: { created_at: "desc" },
      include: {
        iglesia: { select: { id: true, nombre: true } },
      },
    });
    return news;
  }

  async create(data, iglesiaId) {
    const noticia = await prisma.noticia.create({
      data: {
        titulo: data.titulo,
        contenido: data.contenido,
        iglesia_id: iglesiaId,
      },
      include: {
        iglesia: { select: { id: true, nombre: true } },
      },
    });
    return noticia;
  }

  async update(id, data, iglesiaId) {
    const noticia = await prisma.noticia.findFirst({
      where: { id, iglesia_id: iglesiaId },
    });
    if (!noticia) {
      throw new Error("Noticia no encontrada");
    }
    const updated = await prisma.noticia.update({
      where: { id },
      data: {
        titulo: data.titulo,
        contenido: data.contenido,
      },
      include: {
        iglesia: { select: { id: true, nombre: true } },
      },
    });
    return updated;
  }

  async delete(id, iglesiaId) {
    const noticia = await prisma.noticia.findFirst({
      where: { id, iglesia_id: iglesiaId },
    });
    if (!noticia) {
      throw new Error("Noticia no encontrada");
    }
    await prisma.noticia.delete({ where: { id } });
    return { message: "Noticia eliminada" };
  }
}

module.exports = new NewsService();
