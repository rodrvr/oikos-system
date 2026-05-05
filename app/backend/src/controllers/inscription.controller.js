const inscriptionService = require("../services/inscription.service");

class InscriptionController {
  async create(req, res) {
    try {
      const inscription = await inscriptionService.create(
        req.body,
        req.user.user_id,
        req.user.iglesia_id
      );
      res.status(201).json(inscription);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getByEvent(req, res) {
    try {
      const inscriptions = await inscriptionService.getByEvent(
        req.params.id,
        req.user.iglesia_id
      );
      res.json(inscriptions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const inscription = await inscriptionService.update(
        req.params.id,
        req.body,
        req.user.iglesia_id
      );
      res.json(inscription);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new InscriptionController();
