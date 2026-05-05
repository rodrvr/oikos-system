const prisma = require("../config/prisma");

class UserService {
  async getAll(iglesiaId) {
    const users = await prisma.usuario.findMany({
      where: { iglesia_id: iglesiaId },
      select: {
        id: true,
        nombre: true,
        email: true,
        rut: true,
        direccion: true,
        telefono: true,
        telefono_emergencia: true,
        fecha_nacimiento: true,
        foto_url: true,
        iglesia_id: true,
        created_at: true,
        rol: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
    return users;
  }

  async getById(id, iglesiaId) {
    const user = await prisma.usuario.findFirst({
      where: { id, iglesia_id: iglesiaId },
      select: {
        id: true,
        nombre: true,
        email: true,
        rut: true,
        direccion: true,
        telefono: true,
        telefono_emergencia: true,
        fecha_nacimiento: true,
        foto_url: true,
        iglesia_id: true,
        created_at: true,
        rol: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  }

  async create(data, iglesiaId) {
    const existingUser = await prisma.usuario.findFirst({
      where: {
        OR: [{ email: data.email }, { rut: data.rut }],
      },
    });
    if (existingUser) {
      throw new Error("Email o RUT ya registrado");
    }
    const user = await prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        rut: data.rut,
        direccion: data.direccion,
        telefono: data.telefono,
        telefono_emergencia: data.telefono_emergencia,
        fecha_nacimiento: new Date(data.fecha_nacimiento),
        foto_url: data.foto_url,
        iglesia_id: iglesiaId,
        rol_id: data.rol_id,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rut: true,
        direccion: true,
        telefono: true,
        telefono_emergencia: true,
        fecha_nacimiento: true,
        foto_url: true,
        iglesia_id: true,
        created_at: true,
        rol: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
    return user;
  }

  async update(id, data, iglesiaId) {
    const user = await prisma.usuario.findFirst({
      where: { id, iglesia_id: iglesiaId },
    });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    const updatedUser = await prisma.usuario.update({
      where: { id },
      data: {
        nombre: data.nombre,
        email: data.email,
        rut: data.rut,
        direccion: data.direccion,
        telefono: data.telefono,
        telefono_emergencia: data.telefono_emergencia,
        fecha_nacimiento: data.fecha_nacimiento ? new Date(data.fecha_nacimiento) : undefined,
        foto_url: data.foto_url,
        rol_id: data.rol_id,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rut: true,
        direccion: true,
        telefono: true,
        telefono_emergencia: true,
        fecha_nacimiento: true,
        foto_url: true,
        iglesia_id: true,
        created_at: true,
        rol: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
    return updatedUser;
  }

  async delete(id, iglesiaId) {
    const user = await prisma.usuario.findFirst({
      where: { id, iglesia_id: iglesiaId },
    });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    await prisma.usuario.delete({ where: { id } });
    return { message: "Usuario eliminado" };
  }
}

module.exports = new UserService();
