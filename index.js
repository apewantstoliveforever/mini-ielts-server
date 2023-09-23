const express = require('express');
const app = express();
const port = 3002; // You can choose any available port
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Import các tệp route
const postsRouter = require('./routes/postRoutes');

// Sử dụng các route trong ứng dụng
app.use('/posts', postsRouter);

// Define a route for the root URL ("/")
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
