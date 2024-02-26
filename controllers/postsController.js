// controllers/postsController.js
const mysql = require('mysql2');
const multer = require('multer');
//dùng uuid để tạo id cho image
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');


// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '0007',
//   database: 'ielts',
//   reconnect: true, // Sử dụng kết nối lại tự động
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL: ' + err.stack);
//     return;
//   }
//   console.log('Connected to MySQL as id ' + db.threadId);
// });

// setInterval(() => {
//   db.ping((err) => {
//     if (err) {
//       console.error('Error pinging database:', err);
//     } else {
//       console.log('Database pinged successfully.');
//     }
//   });
// }, 60000); // 60 seconds

const db = mysql.createPool({
  connectionLimit: 10, // Adjust this based on your needs
  host: 'localhost',
  user: 'root',
  password: '0007',
  database: 'ielts',
  waitForConnections: true, // Whether the pool should wait for a connection to be released
  queueLimit: 0, // Maximum number of connection requests the pool will queue
  keepAlive: true,
});
function sendQueryToServer() {
  // Define your SQL query here
  const yourQuery = 'SELECT * FROM posts WHERE post_id = ?'; // Replace with your actual query

  db.query(yourQuery, ['ddddd'], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        // Handle disconnection error
        console.log('Database connection lost. Attempting to reconnect...');
        // Attempt to reconnect to the database and retry the query
        db.getConnection((reconnectErr, connection) => {
          if (reconnectErr) {
            console.error('Error reconnecting to the database:', reconnectErr);
          } else {
            connection.query(yourQuery, ['ddddd'], (retryErr, retryResults) => {
              connection.release(); // Release the connection back to the pool
              if (retryErr) {
                console.error('Error executing retry query:', retryErr);
              } else {
                console.log('Query executed successfully after reconnection:', retryResults);
              }
            });
          }
        });
      }
    } else {
      console.log('Query executed successfully:', results);
    }
  });
}


// Schedule the query to run every 30 minutes (30 minutes * 60 seconds * 1000 milliseconds)
const interval = 30 * 60 * 1000;
setInterval(sendQueryToServer, interval);

//lưu file vào folder test trên destop
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination directory where uploaded files will be stored
    //cb(null, 'C:/Users/JakeHu/Desktop/test'); // You should create this directory
    cb(null, '/home/jake/Desktop/ielts-audio'); // Đường dẫn trên Linux

  },
  filename: function (req, file, cb) {
    // Define the filename of the uploaded file
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Giới hạn kích thước tệp tin tải lên thành 10MB
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});


// Define an endpoint to handle CKFinder uploads
const uploadAudio = (req, res) => {
  console.log('uploading')
  // Use the `upload` middleware to handle the file upload
  upload.single('file')(req, res, function (err) {
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
    // const postId = req.body.postId; (nếu bạn cần postId)
    // Random id cho image
    const imageId = req.file.filename;
    return res.json({ message: 'File uploaded successfully', linkId: imageId });
  });
};

// Logic để hiển thị danh sách bài viết
const getPosts = (req, res) => {
  const limit = 12;
  const page = parseInt(req.params.page) || 1;
  const offset = (page - 1) * limit;

  // Query to get the total number of posts
  db.query('SELECT COUNT(*) as total FROM posts', (countErr, countResults) => {
    if (countErr) {
      console.error('Error querying database: ' + countErr);
      return res.status(500).json({ error: 'Database error' });
    }

    const totalPosts = countResults[0].total;

    // Calculate the number of pages
    const totalPages = Math.ceil(totalPosts / limit);

    // Query to get paginated posts
    db.query('SELECT * FROM posts ORDER BY create_date DESC LIMIT ? OFFSET ?', [limit, offset], (err, results) => {
      if (err) {
        console.error('Error querying database: ' + err);
        return res.status(500).json({ error: 'Database error' });
      }

      // Return the results along with the number of pages
      return res.json({ posts: results, totalPages, currentPage: page });
    });
  });
};


const creatListenPost = (req, res) => {
  // Use the `upload` middleware to handle the file upload
  console.log('listening')
  const jsonData = req.body;
  upload.single('file')(req, res, function (err) {
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
    // const postId = req.body.postId; (nếu bạn cần postId)
    // Random id cho image
    const imageId = req.file.filename;
    console.log(imageId);
  });
};

const createPost = (req, res) => {
  console.log('newpost')
  const { post_title, post_type, post_sections } = req.body;
  const post_id = uuidv4().slice(0, 10);
  // Tạo một hàm util để thêm một câu hỏi vào cơ sở dữ liệu
  const addQuestionToDatabase = (question, question_number, section_id) => {
    const question_id = uuidv4().slice(0, 10);
    const question_options = JSON.stringify(question.question_options);
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO questions (question_id, question_text, question_answer, question_number, question_options, section_id) VALUES (?, ?, ?, ?, ?, ?)', [question_id, question.question_text, question.question_answer, question_number, question_options, section_id], (err, result) => {
        if (err) {
          console.error('Error inserting into questions: ' + err);
          reject(err);
        } else {
          resolve(result.insertId);
        }
      });
    });
  };

  // Tạo một hàm util để thêm một phần vào cơ sở dữ liệu và liên kết nó với các câu hỏi
  const addSectionToDatabase = (section, section_number) => {
    const section_id = uuidv4().slice(0, 10);
    console.log(section_number);
    return Promise.all(section.section_questions.map((question, index) => addQuestionToDatabase(question, index + 1, section_id)))
      .then((questionIds) => {
        return new Promise((resolve, reject) => {
          db.query('INSERT INTO sections (section_id, section_title, section_detail, section_type, post_id, section_number) VALUES (?, ?, ?, ?, ?, ?)', [section_id, section.section_title, section.section_detail, section.section_type, post_id, section_number], (err, result) => {
            if (err) {
              console.error('Error inserting into sections: ' + err);
              reject(err);
            } else {
              resolve({ sectionId: result.insertId, questionIds });
            }
          });
        });
      });
  };

  // Thêm các phần và câu hỏi vào cơ sở dữ liệu
  Promise.all(post_sections.map((section, index) => addSectionToDatabase(section, index + 1)))
    .then((sectionData) => {
      return new Promise((resolve, reject) => {
        if (post_type === 'reading') {
          reading_text = req.body.reading_text;
        } else {
          reading_text = null;
        }
        if (post_type === 'listen') {
          listening_link = req.body.listening_link;
        }
        else {
          listening_link = null;
        }
        db.query('INSERT INTO posts (post_id, post_title, post_type, reading_text, listening_link) VALUES (?, ?, ?, ?, ?)', [post_id, post_title, post_type, reading_text, listening_link], (err, postResult) => {
          if (err) {
            console.error('Error inserting into posts: ' + err);
            reject(err);
          } else {
            resolve({ postId: postResult.insertId, sectionData });
          }
        });
      });
    })
    .then((postData) => {
      // Có thể thực hiện các liên kết bổ sung ở đây nếu cần

      res.status(201).json({ message: 'Post and sections created successfully', postId: postData.postId });
    })
    .catch((error) => {
      console.error('Error inserting data: ' + error);
      res.status(500).json({ error: 'Database error' });
    });
};



// Logic để hiển thị chi tiết bài viết
const getPostById = (req, res) => {
  const postId = req.params.id;
  // Thực hiện truy vấn cơ sở dữ liệu để lấy thông tin bài viết và các phần liên quan
  // Thay thế các dòng sau bằng mã truy vấn cơ sở dữ liệu thực tế của bạn

  const getPostQuery = 'SELECT * FROM posts WHERE post_id = ?';
  const getSectionsQuery = 'SELECT * FROM sections WHERE post_id = ? ORDER BY section_number';
  const getQuestionsQuery = 'SELECT * FROM questions WHERE section_id = ? ORDER BY question_number';

  db.query(getPostQuery, [postId], (postErr, postResults) => {
    if (postErr) {
      console.error('Error fetching post: ' + postErr);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    const post = postResults[0];
    db.query(getSectionsQuery, [postId], (sectionErr, sectionResults) => {
      if (sectionErr) {
        console.error('Error fetching sections: ' + sectionErr);
        res.status(500).json({ error: 'Database error' });
        return;
      }

      const sections = sectionResults;

      // Lặp qua từng phần để lấy câu hỏi tương ứng
      Promise.all(sections.map((section) => {
        return new Promise((resolve, reject) => {
          db.query(getQuestionsQuery, [section.section_id], (questionErr, questionResults) => {
            if (questionErr) {
              console.error('Error fetching questions: ' + questionErr);
              reject(questionErr);
              return;
            }

            section.questions = questionResults;
            resolve(section);
          });
        });
      })).then((sectionsWithQuestions) => {
        post.sections = sectionsWithQuestions;

        res.status(200).json(post);
      }).catch((error) => {
        console.error('Error fetching data: ' + error);
        res.status(500).json({ error: 'Database error' });
      });
    });
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
  try {
    db.query('DELETE FROM posts WHERE post_id = ?', [postId], (err, result) => {
      if (err) {
        console.error('Error deleting from database: ' + err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      // Xóa các phần và câu hỏi liên quan
      db.query('DELETE FROM sections WHERE post_id = ?', [postId], (sectionErr, sectionResult) => {
        if (sectionErr) {
          console.error('Error deleting from database: ' + sectionErr);
          return res.status(500).json({ error: 'Database error' });
        }
        db.query('DELETE FROM questions WHERE section_id IN (SELECT section_id FROM sections WHERE post_id = ?)', [postId], (questionErr, questionResult) => {
          if (questionErr) {
            console.error('Error deleting from database: ' + questionErr);
            return res.status(500).json({ error: 'Database error' });
          }
        });
      });
      return res.json({ message: 'Post deleted successfully' });
    });

  } catch (error) {
    console.error('Error deleting from database: ' + error);
    return res.status(500).json({ error: 'Database error' });
  };
};

const getListening = (req, res) => {
  const limit = 12;
  const page = parseInt(req.params.page) || 1;
  const offset = (page - 1) * limit;

  // Query to get the total number of posts with post_type = 'listen'
  db.query('SELECT COUNT(*) as total FROM posts WHERE post_type = ?', ['listen'], (countErr, countResults) => {
    if (countErr) {
      console.error('Error querying database: ' + countErr);
      return res.status(500).json({ error: 'Database error' });
    }

    const totalPosts = countResults[0].total;

    // Calculate the number of pages
    const totalPages = Math.ceil(totalPosts / limit);

    // Query to get paginated posts with post_type = 'listen'
    db.query('SELECT * FROM posts WHERE post_type = ? ORDER BY create_date DESC LIMIT ? OFFSET ?', ['listen', limit, offset], (err, results) => {
      if (err) {
        console.error('Error querying database: ' + err);
        return res.status(500).json({ error: 'Database error' });
      }

      // Return the results along with the number of pages
      return res.json({ posts: results, totalPages, currentPage: page });
    });
  });
};

const getReading = (req, res) => {
  const limit = 12;
  const page = parseInt(req.params.page) || 1;
  const offset = (page - 1) * limit;

  // Query to get the total number of posts with post_type = 'reading'
  db.query('SELECT COUNT(*) as total FROM posts WHERE post_type = ?', ['reading'], (countErr, countResults) => {
    if (countErr) {
      console.error('Error querying database: ' + countErr);
      return res.status(500).json({ error: 'Database error' });
    }

    const totalPosts = countResults[0].total;

    // Calculate the number of pages
    const totalPages = Math.ceil(totalPosts / limit);

    // Query to get paginated posts with post_type = 'reading'
    db.query('SELECT * FROM posts WHERE post_type = ? ORDER BY create_date DESC LIMIT ? OFFSET ?', ['reading', limit, offset], (err, results) => {
      if (err) {
        console.error('Error querying database: ' + err);
        return res.status(500).json({ error: 'Database error' });
      }

      // Return the results along with the number of pages
      return res.json({ posts: results, totalPages, currentPage: page });
    });
  });
}

//save result of test
const saveResult = (req, res) => {
  const { id, point, selectedAnswers } = req.body;
  var user_id = req.user.uid;
  const post_id = id;
  const result_id = uuidv4().slice(0, 10);
  const answers = JSON.stringify(selectedAnswers);
  console.log('save result', point);
  db.query('INSERT INTO results (result_id, post_id, user_id, point, answers) VALUES (?, ?, ?, ?, ?)', [result_id, post_id, user_id, point, answers], (err, result) => {
    if (err) {
      console.error('Error inserting into results: ' + err);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.json({ message: 'Result saved successfully' });
  });
}

const getUserResults = (req, res) => {
  console.log('get result')
  const user_id = req.user.uid;
  db.query('SELECT * FROM results WHERE user_id = ?', [user_id], (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.json({ results: results });
  });
}

const getTraffic = (req, res) => {
  const email = "hotranphihung@gmail.com";
  const apiKey = "74c7da815ef6c9699b13aad7df9b5204b8818";
  const zoneTag = "4d1c6770911b9bc0bfecc96baed97502";
  const axios = require('axios');
  const url = 'https://api.cloudflare.com/client/v4/graphql';
  let query = { "query": "{\n  viewer {\n    zones(filter: { zoneTag: " + zoneTag + " }) {\n      httpRequests1dGroups(\n        orderBy: [date_ASC]\n        limit: 1000\n        filter: { date_gt: \"2019-07-15\" }\n      ) {\n        date: dimensions {\n          date\n        }\n        sum {\n          cachedBytes\n          bytes\n        }\n      }\n    }\n  }\n}", "variables": {} }

  async function fetchData() {
    try {
      const response = await axios.post(
        url,
        {
          query: `
            {
              viewer {
                zones(filter: { zoneTag: "4d1c6770911b9bc0bfecc96baed97502" }) {
                  httpRequests1dGroups(
                    filter: { date_gt: "2024-02-10" }
                    orderBy: [date_ASC]
                    limit: 10000
                  ) {
                    dimensions { date }
                    sum {
                      requests,
                      pageViews
                    }
                  }
                }
              }
            }
          `
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Email': email,
            'X-Auth-Key': apiKey
          }
        }
      );

      console.log(response.data.data);
      return res.json({ data: response.data.data });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  fetchData();
};

const getViewerLocation = (req, res) => {
  console.log('get location');
  const email = "hotranphihung@gmail.com";
  const apiKey = "74c7da815ef6c9699b13aad7df9b5204b8818";
  const zoneTag = "4d1c6770911b9bc0bfecc96baed97502";
  const axios = require('axios');
  const url = 'https://api.cloudflare.com/client/v4/graphql';
  //query to get viewer location
  let query = `
    {
      viewer {
        zones(filter: {zoneTag: "${zoneTag}" }) {
          httpRequests1dGroups(
            filter: {
              date_gt : "2024-02-01"
            }
            orderBy: [date_ASC]
            limit: 10000
          ) {
            dimensions { date }
            sum {
              requests,
              pageViews,
              countryMap {
                bytes
                requests
                threats
                clientCountryName
              }
            }
          }
        }
      }
    }
  `;
  async function fetchData() {
    try {
      const response = await axios.post(
        url,
        {
          query: query
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Email': email,
            'X-Auth-Key': apiKey
          }
        }
      );
      console.log(response.data.data);
      return res.json({ data: response.data.data });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  fetchData();
};




module.exports = {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getListening,
  getReading,
  uploadAudio,
  creatListenPost,
  saveResult,
  getUserResults,
  getTraffic,
  getViewerLocation
};
