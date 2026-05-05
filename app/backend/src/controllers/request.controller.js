const requestService = require("../services/request.service");

class RequestController {
  async create(req, res) {
    try {
      const solicitud = await requestService.create(
        req.body,
        req.user.user_id,
        req.user.iglesia_id
      );
      res.status(201).json(solicitud);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const solicitudes = await requestService.getAll(
        req.user.user_id,
        req.user.rol_id,
        req.user.iglesia_id
      );
      res.json(solicitudes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const solicitud = await requestService.getById(
        req.params.id,
        req.user.user_id,
        req.user.rol_id,
        req.user.iglesia_id
      );
      res.json(solicitud);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const solicitud = await requestService.update(
        req.params.id,
        req.body,
        req.user.user_id,
        req.user.iglesia_id
      );
      res.json(solicitud);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new RequestController();
