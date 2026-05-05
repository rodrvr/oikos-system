const eventService = require("../services/event.service");

class EventController {
  async getAll(req, res) {
    try {
      const events = await eventService.getAll(req.user.iglesia_id);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const event = await eventService.getById(req.params.id, req.user.iglesia_id);
      res.json(event);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const event = await eventService.create(req.body, req.user.iglesia_id);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const event = await eventService.update(req.params.id, req.body, req.user.iglesia_id);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await eventService.delete(req.params.id, req.user.iglesia_id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  async getGlobal(req, res) {
    try {
      const events = await eventService.getGlobal();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new EventController();
