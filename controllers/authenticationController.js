const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const admin = require('firebase-admin');

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

// Register
const register = async (req, res) => {
  const { email, password, displayName, photoURL } = req.body;
  try {
    console.log(email, password);

    // Create a new user using email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update the user's profile with displayName and photoURL (if provided)
    if (displayName) {
      await userCredential.user.updateProfile({ displayName });
    }
    if (photoURL) {
      await userCredential.user.updateProfile({ photoURL });
    }

    console.log('User registered:', userCredential.user.uid);
    return res.status(200).json();
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json(error);
  }
};

// Export
module.exports = {
  login,
  register,
};
