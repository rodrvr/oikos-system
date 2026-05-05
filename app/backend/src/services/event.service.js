const prisma = require("../config/prisma");

class EventService {
  async getAll(iglesiaId) {
    const events = await prisma.evento.findMany({
      where: { iglesia_id: iglesiaId },
      include: {
        iglesia: {
          select: { id: true, nombre: true },
        },
      },
    });
    return events;
  }

  async getById(id, iglesiaId) {
    const event = await prisma.evento.findFirst({
      where: { id, iglesia_id: iglesiaId },
      include: {
        iglesia: {
          select: { id: true, nombre: true },
        },
      },
    });
    if (!event) {
      throw new Error("Evento no encontrado");
    }
    return event;
  }

  async create(data, iglesiaId) {
    const event = await prisma.evento.create({
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        fecha: new Date(data.fecha),
        cupos: data.cupos,
        tipo: data.tipo,
        es_global: data.es_global || false,
        iglesia_id: iglesiaId,
      },
      include: {
        iglesia: {
          select: { id: true, nombre: true },
        },
      },
    });
    return event;
  }

  async update(id, data, iglesiaId) {
    const event = await prisma.evento.findFirst({
      where: { id, iglesia_id: iglesiaId },
    });
    if (!event) {
      throw new Error("Evento no encontrado");
    }
    const updatedEvent = await prisma.evento.update({
      where: { id },
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        fecha: data.fecha ? new Date(data.fecha) : undefined,
        cupos: data.cupos,
        tipo: data.tipo,
        es_global: data.es_global,
      },
      include: {
        iglesia: {
          select: { id: true, nombre: true },
        },
      },
    });
    return updatedEvent;
  }

  async delete(id, iglesiaId) {
    const event = await prisma.evento.findFirst({
      where: { id, iglesia_id: iglesiaId },
    });
    if (!event) {
      throw new Error("Evento no encontrado");
    }
    await prisma.evento.delete({ where: { id } });
    return { message: "Evento eliminado" };
  }

  async getGlobal() {
    const events = await prisma.evento.findMany({
      where: { es_global: true },
      include: {
        iglesia: {
          select: { id: true, nombre: true },
        },
      },
      orderBy: { fecha: "asc" },
    });
    return events;
  }

  async getCuposDisponibles(eventoId) {
    const event = await prisma.evento.findUnique({ where: { id: eventoId } });
    if (!event) {
      throw new Error("Evento no encontrado");
    }
    const inscripcionesAprobadas = await prisma.inscripcion.count({
      where: { evento_id: eventoId, estado: "APROBADO" },
    });
    return event.cupos - inscripcionesAprobadas;
  }

  async validarCupo(eventoId) {
    const disponibles = await this.getCuposDisponibles(eventoId);
    if (disponibles <= 0) {
      throw new Error("No hay cupos disponibles para este evento");
    }
    return true;
  }
}

module.exports = new EventService();
