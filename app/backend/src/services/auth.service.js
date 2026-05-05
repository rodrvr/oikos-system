const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const { validateInput } = require("../utils/validators");

const JWT_SECRET = process.env.JWT_SECRET || "oikos_secret_key";

class AuthService {
  async register(data) {
    validateInput(data, {
      required: ["nombre", "email", "password", "rut", "iglesia_id", "rol_id"],
      email: true,
      password: true,
      rut: true,
    });

    const existingUser = await prisma.usuario.findFirst({
      where: {
        OR: [{ email: data.email }, { rut: data.rut }],
      },
    });

    if (existingUser) {
      throw new Error("Email o RUT ya registrado");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        password: hashedPassword,
        rut: data.rut,
        direccion: data.direccion,
        telefono: data.telefono,
        telefono_emergencia: data.telefono_emergencia,
        fecha_nacimiento: new Date(data.fecha_nacimiento),
        foto_url: data.foto_url,
        iglesia_id: data.iglesia_id,
        rol_id: data.rol_id,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rut: true,
        iglesia_id: true,
        rol_id: true,
      },
    });

    return user;
  }

  async login(data) {
    validateInput(data, {
      required: ["email", "password"],
      email: true,
      password: true,
    });

    const user = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const validPassword = await bcrypt.compare(data.password, user.password);

    if (!validPassword) {
      throw new Error("Credenciales inválidas");
    }

    const token = jwt.sign(
      {
        user_id: user.id,
        rol_id: user.rol_id,
        iglesia_id: user.iglesia_id,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return { token, user_id: user.id };
  }
}

module.exports = new AuthService();
