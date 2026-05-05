const prisma = require("../config/prisma");

class RequestService {
  async create(data, userId, iglesiaId) {
    const pastor = await prisma.usuario.findFirst({
      where: { id: data.pastor_id, iglesia_id: iglesiaId },
    });
    if (!pastor) {
      throw new Error("Pastor no encontrado o no pertenece a tu iglesia");
    }

    const solicitud = await prisma.solicitud.create({
      data: {
        usuario_id: userId,
        pastor_id: data.pastor_id,
        mensaje: data.mensaje,
        estado: "PENDIENTE",
        fecha_solicitada: data.fecha_solicitada
          ? new Date(data.fecha_solicitada)
          : new Date(),
      },
      include: {
        usuario: {
          select: { id: true, nombre: true, email: true },
        },
        pastor: {
          select: { id: true, nombre: true, email: true },
        },
      },
    });
    return solicitud;
  }

  async getAll(userId, rolId, iglesiaId) {
    const rol = await prisma.rol.findUnique({ where: { id: rolId } });
    const isPastor = rol.nombre === "PASTOR";

    const where = isPastor
      ? { pastor_id: userId, pastor: { iglesia_id: iglesiaId } }
      : { usuario_id: userId, usuario: { iglesia_id: iglesiaId } };

    const solicitudes = await prisma.solicitud.findMany({
      where,
      include: {
        usuario: {
          select: { id: true, nombre: true, email: true },
        },
        pastor: {
          select: { id: true, nombre: true, email: true },
        },
      },
      orderBy: { created_at: "desc" },
    });
    return solicitudes;
  }

  async getById(id, userId, rolId, iglesiaId) {
    const solicitud = await prisma.solicitud.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { id: true, nombre: true, email: true, iglesia_id: true },
        },
        pastor: {
          select: { id: true, nombre: true, email: true, iglesia_id: true },
        },
      },
    });
    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    if (
      solicitud.usuario.iglesia_id !== iglesiaId &&
      solicitud.pastor.iglesia_id !== iglesiaId
    ) {
      throw new Error("No tienes acceso a esta solicitud");
    }

    const rol = await prisma.rol.findUnique({ where: { id: rolId } });
    const isPastor = rol.nombre === "PASTOR";

    if (!isPastor && solicitud.usuario_id !== userId) {
      throw new Error("No tienes acceso a esta solicitud");
    }

    return solicitud;
  }

  async update(id, data, userId, iglesiaId) {
    const solicitud = await prisma.solicitud.findUnique({
      where: { id },
      include: {
        pastor: { select: { id: true, iglesia_id: true } },
      },
    });
    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    if (solicitud.pastor_id !== userId) {
      throw new Error("Solo el pastor asignado puede responder esta solicitud");
    }

    if (solicitud.pastor.iglesia_id !== iglesiaId) {
      throw new Error("No puedes gestionar solicitudes de otra iglesia");
    }

    const updated = await prisma.solicitud.update({
      where: { id },
      data: {
        estado: data.estado,
        fecha_solicitada: data.fecha_solicitada
          ? new Date(data.fecha_solicitada)
          : undefined,
      },
      include: {
        usuario: {
          select: { id: true, nombre: true, email: true },
        },
        pastor: {
          select: { id: true, nombre: true, email: true },
        },
      },
    });
    return updated;
  }
}

module.exports = new RequestService();
