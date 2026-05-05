const newsService = require("../services/news.service");

class NewsController {
  async getAll(req, res) {
    try {
      const news = await newsService.getAll();
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const noticia = await newsService.create(req.body, req.user.iglesia_id);
      res.status(201).json(noticia);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const noticia = await newsService.update(req.params.id, req.body, req.user.iglesia_id);
      res.json(noticia);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await newsService.delete(req.params.id, req.user.iglesia_id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new NewsController();
