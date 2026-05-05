const churchService = require("../services/church.service");

class ChurchController {
  async getAll(req, res) {
    try {
      const churches = await churchService.getAll();
      res.json(churches);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const church = await churchService.getById(req.params.id);
      res.json(church);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  async getMyChurch(req, res) {
    try {
      const church = await churchService.getMyChurch(req.user.iglesia_id);
      res.json(church);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new ChurchController();
