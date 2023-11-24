const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const admin = require('firebase-admin');
//import firebase/storage module
const { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, uploadString } = require('@firebase/storage');
//const storage = getStorage();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { profile } = require('console');




// // Replace with the path to your service account key JSON file
// const serviceAccount = require('../serviceAccountKey.json');

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const firebaseConfig = {
//     apiKey: "AIzaSyAPnRzT1qySbDDEfiEJBquEG25GA89W39c",
//     authDomain: "skilful-grove-269507.firebaseapp.com",
//     projectId: "skilful-grove-269507",
//     storageBucket: "skilful-grove-269507.appspot.com",
//     messagingSenderId: "432191319446",
//     appId: "1:432191319446:web:f7be058cde68661b4101b7",
//     measurementId: "G-7E2L3P37JW"
//   };

// // Initialize Firebase App
// initializeApp(firebaseConfig);
// Initialize Firebase Auth
const auth = getAuth();

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(email, password);

    // Sign in the user using email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Access the signed-in user's data
    const user = userCredential.user;
    console.log(user)
    //token
    const token = await user.getIdToken();
    console.log(token);
    console.log('User signed in:', user.uid, user.email, token);

    return res.status(200).json({ uid: user.uid, email: user.email, token });
  } catch (error) {
    console.error('Error signing in:', error);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
};

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '"C:/Users/JakeHu/Desktop/test/upload"'); // Save files in the "uploads" directory
  },
  filename: function (req, file, cb) {
    // Use the user's ID as the filename
    const userId = req.user.uid; // Make sure you have access to the user's ID
    cb(null, `${userId}.png`);
  },
});
const upload = multer({ storage: storage });


const register = async (req, res) => {
  const { email, password, displayName, photoURL } = req.body;

  try {
    if (!photoURL) {
      return res.status(400).json({ error: 'Photo URL is required' });
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (!userCredential.user) {
      console.error('Error creating user: User not returned');
      return res.status(500).json({ error: 'User not returned' });
    }

    try {
      // Convert base64 to Buffer
      const imageBuffer = Buffer.from(photoURL.split(',')[1], 'base64');
      //const fileName = `${userCredential.user.uid}.png`;
      const fileName = `profile.png`;
      //fs.writeFileSync(fileName, imageBuffer);
      //wrte vao folder tren desktop
      //fs.writeFileSync(`C:/Users/JakeHu/Desktop/test/upload/${userCredential.user.uid}/${fileName}`, imageBuffer);
       // Create user folder if it doesn't exist
       const userFolderPath = path.join(__dirname, `/home/jake/Desktop/mini-ielts/users/${userCredential.user.uid}`);
       if (!fs.existsSync(userFolderPath)) {
         fs.mkdirSync(userFolderPath, { recursive: true });
       }
 
       const filePath = path.join(userFolderPath, fileName);
 
       fs.writeFileSync(filePath, imageBuffer);

    } catch (fileSaveError) {
      console.error('Error saving file:', fileSaveError);
      return res.status(500).json({ error: 'Error saving file' });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Error creating user' });
  }
};

// Export
module.exports = {
  login,
  register,
};
