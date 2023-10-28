// routes/posts.js

const express = require('express');
const router = express.Router();
const MangasController = require('../controllers/MangasController');

router.get('/all', MangasController.getAllMangas);
//pagination for manga
router.get('/all/:page', MangasController.getAllMangas);

router.get('/:id', MangasController.getAllChaptersbyMangaId);
router.get('/chapter/:id', MangasController.getChapterbyChapterId);
module.exports = router;
