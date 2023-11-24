const admin = require('firebase-admin');

// const serviceAccount = require('../serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

const auth = admin.auth();


const authenticationMiddleware = async (req, res, next) => {
    // const idToken = req.headers.authorization;
    const idToken = req.headers['x-access-token']; // Use 'x-access-token' header
    console.log(idToken);

    if (!idToken) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        await auth.verifyIdToken(idToken);
        req.user = { /* Extract user information from token */ };
        next();
    } catch (error) {
        console.error(error);
        res.status(401).send('Unauthorized');
    }
};

module.exports = { authenticationMiddleware };