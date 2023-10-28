require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev'
});

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

const corsOptions = {
  origin: ['http://localhost:3005', "https://apewannaliveforever.online"] 
};

app.use(cors(corsOptions));

// Import các tệp route
const mangasRouter = require('./routes/mangaRoutes');
// Sử dụng các route trong ứng dụng
app.use('/manga', mangasRouter);

// Import các tệp route
const postsRouter = require('./routes/postRoutes');
// Sử dụng các route trong ứng dụng
app.use('/posts', postsRouter);

// Import thư viện multer
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination directory where uploaded files will be stored
    cb(null, './uploads'); // You should create this directory
  },
  filename: function (req, file, cb) {
    // Define the filename of the uploaded file
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Define an endpoint to handle CKFinder uploads
app.post('/uploadck', (req, res) => {
  console.log(req.data);
  // 'upload' is the name of the field in the FormData sent by CKFinder
  // You can access the uploaded file information as req.file
  
  // Handle the uploaded file here, e.g., save it to a database or return a response
  res.json({ message: 'File uploaded successfully' });
});


// Define a route for the root URL ("/")
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
