const prisma = require("../config/prisma");
const eventService = require("./event.service");

class InscriptionService {
  async create(data, userId, iglesiaId) {
    const event = await prisma.evento.findUnique({
      where: { id: data.evento_id },
    });
    if (!event) {
      throw new Error("Evento no encontrado");
    }

    if (event.iglesia_id !== iglesiaId) {
      throw new Error("No puedes inscribirte a un evento de otra iglesia");
    }

    const existing = await prisma.inscripcion.findFirst({
      where: {
        usuario_id: userId,
        evento_id: data.evento_id,
      },
    });
    if (existing) {
      throw new Error("Ya estás inscrito en este evento");
    }

    await eventService.validarCupo(data.evento_id);

    const estado = event.tipo === "GRATIS" ? "APROBADO" : "PENDIENTE";

    if (event.tipo === "GRATIS" && data.comprobante_url) {
      throw new Error("No se permite comprobante en eventos gratuitos");
    }

    const comprobanteUrl = event.tipo === "PAGO" ? data.comprobante_url || null : null;

    const inscription = await prisma.inscripcion.create({
      data: {
        usuario_id: userId,
        evento_id: data.evento_id,
        estado,
        comprobante_url: comprobanteUrl,
      },
      include: {
        usuario: {
          select: { id: true, nombre: true, email: true },
        },
        evento: {
          select: { id: true, titulo: true, fecha: true, tipo: true },
        },
      },
    });
    return inscription;
  }

  async getByEvent(eventoId, iglesiaId) {
    const event = await prisma.evento.findUnique({ where: { id: eventoId } });
    if (!event) {
      throw new Error("Evento no encontrado");
    }
    if (event.iglesia_id !== iglesiaId) {
      throw new Error("No puedes ver inscripciones de otra iglesia");
    }

    const inscriptions = await prisma.inscripcion.findMany({
      where: { evento_id: eventoId },
      include: {
        usuario: {
          select: { id: true, nombre: true, email: true, rut: true },
        },
        evento: {
          select: { id: true, titulo: true, fecha: true, tipo: true, cupos: true },
        },
      },
    });
    return inscriptions;
  }

  async update(id, data, iglesiaId) {
    const inscription = await prisma.inscripcion.findUnique({
      where: { id },
      include: { evento: true },
    });
    if (!inscription) {
      throw new Error("Inscripción no encontrada");
    }

    if (inscription.evento.iglesia_id !== iglesiaId) {
      throw new Error("No puedes gestionar inscripciones de otra iglesia");
    }

    if (data.estado === "APROBADO") {
      await eventService.validarCupo(inscription.evento_id);
    }

    const updated = await prisma.inscripcion.update({
      where: { id },
      data: {
        estado: data.estado,
        comprobante_url: data.comprobante_url ?? undefined,
      },
      include: {
        usuario: {
          select: { id: true, nombre: true, email: true },
        },
        evento: {
          select: { id: true, titulo: true, fecha: true, tipo: true },
        },
      },
    });
    return updated;
  }
}

module.exports = new InscriptionService();
