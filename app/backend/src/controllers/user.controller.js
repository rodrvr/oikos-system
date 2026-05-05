const userService = require("../services/user.service");

class UserController {
  async getAll(req, res) {
    try {
      const users = await userService.getAll(req.user.iglesia_id);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const user = await userService.getById(req.params.id, req.user.iglesia_id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const user = await userService.create(req.body, req.user.iglesia_id);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const user = await userService.update(req.params.id, req.body, req.user.iglesia_id);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await userService.delete(req.params.id, req.user.iglesia_id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
