const prisma = require("../config/prisma");

function roleMiddleware(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const rol = await prisma.rol.findUnique({
        where: { id: req.user.rol_id },
      });

      if (!rol) {
        return res.status(403).json({ error: "Rol no encontrado" });
      }

      if (!allowedRoles.includes(rol.nombre)) {
        return res.status(403).json({ error: "No tienes permisos para esta acción" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
}

module.exports = roleMiddleware;
