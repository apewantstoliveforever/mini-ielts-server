// controllers/postsController.js
const mysql = require('mysql2');
const multer = require('multer');
//dùng uuid để tạo id cho image
const { v4: uuidv4 } = require('uuid');


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

//lưu file vào folder test trên destop
const storage = multer.diskStorage({
  //dùng uuid để tạo tên cho file
  
  destination: function (req, file, cb) {
    cb(null, 'C:/Users/JakeHu/Desktop/test');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + `${file.originalname.split('.')[1]}`);
    //cb(null, uuidv4() + '.jpg');
  }
});
const upload = multer({ storage: storage }).single('file');
//logic để upload image và lưu path vào database

const uploadImage = (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error('Error uploading file: ' + err);
      return res.status(500).json({ error: 'Error uploading file' });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.error('Error uploading file: ' + err);
      return res.status(500).json({ error: 'Error uploading file' });
    }
    // Everything went fine.
    const path = req.file.path;
    
    console.log(path);
    //const postId = req.body.postId;
    //random id cho image
    const imageId = req.file.filename;
    db.query('INSERT INTO images (path, image_id) VALUES (?, ?)', [path, imageId], (err, result) => {
      if (err) {
        console.error('Error inserting into database: ' + err);
        return res.status(500).json({ error: 'Database error' });
      }
      return res.status(201).json({ message: 'Image uploaded successfully', imageId: result.insertId });
    });
  });
}

// Logic để upload file
const uploadFile = (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error('Error uploading file: ' + err);
      return res.status(500).json({ error: 'Error uploading file' });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.error('Error uploading file: ' + err);
      return res.status(500).json({ error: 'Error uploading file' });
    }
    // Everything went fine.
    return res.json({ message: 'File uploaded successfully' });
  });
};

//upload image from ckeditor
const uploadImageCKEditor = (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error('Error uploading file: ' + err);
      return res.status(500).json({ error: 'Error uploading file' });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.error('Error uploading file: ' + err);
      return res.status(500).json({ error: 'Error uploading file' });
    }
    // Everything went fine.
    const path = req.file.path;
    console.log(path);
    return res.json({ message: 'File uploaded successfully', url: path });
  });
}

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
  console.log(req.body.content);
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
  uploadImage,
};
