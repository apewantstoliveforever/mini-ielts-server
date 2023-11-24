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
        const decodedToken = await auth.verifyIdToken(idToken);
        const userId = decodedToken.uid;
        console.log(userId);
        req.user = await auth.getUser(userId);
        console.log('check', req.user);
        next();
    } catch (error) {
        console.error(error);
        res.status(401).send('Unauthorized');
    }
};

module.exports = { authenticationMiddleware };