const verseService = require("../services/verse.service");

class VerseController {
  getDaily(req, res) {
    try {
      const verse = verseService.getDaily();
      res.json(verse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new VerseController();
