// controllers/postsController.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0007',
  database: 'blogpersonal',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});
// Logic để hiển thị danh sách bài viết
const getPosts = (req, res) => {
  db.query('SELECT * FROM posts', (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.json(results);
  });
};

// Logic để tạo bài viết mới
const createPost = (req, res) => {
  const { title, content } = req.body;
  console.log(req.body);
  db.query('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content], (err, result) => {
    if (err) {
      console.error('Error inserting into database: ' + err);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
  });
};

// Logic để hiển thị chi tiết bài viết
const getPostById = (req, res) => {
  const postId = req.params.id;
  db.query('SELECT * FROM posts WHERE id = ?', [postId], (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.json(results[0]);
  });
};

// Logic để cập nhật bài viết
const updatePost = (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  db.query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, postId], (err, result) => {
    if (err) {
      console.error('Error updating database: ' + err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.json({ message: 'Post updated successfully' });
  });
};

// Logic để xóa bài viết
const deletePost = (req, res) => {
  const postId = req.params.id;
  db.query('DELETE FROM posts WHERE id = ?', [postId], (err, result) => {
    if (err) {
      console.error('Error deleting from database: ' + err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.json({ message: 'Post deleted successfully' });
  });
};

module.exports = {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
};
