// routes/posts.js

const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const { authenticationMiddleware } = require('../middlewares/firebaseAuthentication');
const { AdminRole } = require('../middlewares/authorization');

// Route để hiển thị danh sách bài viết
router.get('/page/:page', postsController.getPosts);

// Route để tạo bài viết mới
router.post('/', authenticationMiddleware, AdminRole, postsController.createPost);

//route save result
router.post('/saveResult', authenticationMiddleware, postsController.saveResult);

//get result
router.get('/getUserResults', authenticationMiddleware, postsController.getUserResults);

// Route để hiển thị chi tiết bài viết
router.get('/:id', postsController.getPostById);

// Route để cập nhật bài viết
router.put('/:id', postsController.updatePost);

// Route để xóa bài viết
router.delete('/:id',authenticationMiddleware, AdminRole, postsController.deletePost);


//Route hiện danh sách bài vieert reading
router.get('/reading/:page', postsController.getReading);
//Route hiện danh sách bài vieert listening
router.get('/listening/:page', postsController.getListening);

//Route post file audio
router.post('/uploadAudio', postsController.uploadAudio);

//Route post listening
router.post('/creatListenPost', postsController.creatListenPost);

//route save result
router.post('/saveResult', postsController.saveResult);

module.exports = router;
