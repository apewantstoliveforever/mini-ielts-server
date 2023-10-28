//MangaController.js
const mysql = require('mysql2');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0007',
    database: 'clonetruyen',
  });




  // getAllChaptersbyMangaId in table chapter_content, query all chapters by manga_id
  const getAllChaptersbyMangaId = (req, res) => {
    const mangaId = req.params.id;
    db.query('SELECT * FROM chapter_content WHERE manga_id = ? ORDER BY chapter_number', [mangaId], (err, result) => {
      if (err) {
        console.error('Error getting chapters from the database: ' + err);
        return res.status(500).json({ error: 'Database error' });
      }
      return res.status(200).json(result);
    });
  }

  const getChapterbyChapterId = (req, res) => {
    const chapterId = req.params.id;
    console.log('all')
    db.query('SELECT * FROM chapter_content WHERE chapter_id = ?', [chapterId], (err, result) => {
      if (err) {
        console.error('Error getting chapters from the database: ' + err);
        return res.status(500).json({ error: 'Database error' });
      }
      return res.status(200).json(result[0]);
    });
  }

  const getAllMangas = (req, res) => {
    const page = req.params.page;
    const limit = 12;
    const offset = (page - 1) * limit;
    db.query('SELECT * FROM manga ORDER BY manga_id LIMIT ? OFFSET ?', [limit, offset], (err, result) => {
      if (err) {
        console.error('Error getting mangas from the database: ' + err);
        return res.status(500).json({ error: 'Database error' });
      }
      return res.status(200).json(result);
    });
  }
  
  // Export the functions
  module.exports = {
    getAllChaptersbyMangaId,
    getChapterbyChapterId,
    getAllMangas,
  }