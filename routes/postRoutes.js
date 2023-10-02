// routes/posts.js

const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

// Route để hiển thị danh sách bài viết
router.get('/', postsController.getPosts);

// Route để tạo bài viết mới
router.post('/', postsController.createPost);

// Route để hiển thị chi tiết bài viết
router.get('/:id', postsController.getPostById);

// Route để cập nhật bài viết
router.put('/:id', postsController.updatePost);

// Route để xóa bài viết
router.delete('/:id', postsController.deletePost);

//Route để upload image trong bài viết
router.post('/uploadImage', postsController.uploadImage);

module.exports = router;
