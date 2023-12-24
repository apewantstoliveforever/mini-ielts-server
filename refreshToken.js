const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const admin = require('firebase-admin');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithCustomToken } = require('firebase/auth');
const axios = require('axios');

const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '0007',
    database: 'ielts',
    waitForConnections: true,
    queueLimit: 0,
    keepAlive: true,
});

const url = "https://securetoken.googleapis.com/v1/token?key=AIzaSyAPnRzT1qySbDDEfiEJBquEG25GA89W39c";
const auth = admin.auth();
const refreshToken = async (req, res, next) => {
    console.log('refreshToken');
    const { refreshToken } = req.body;
    try {
        const response = await axios.post(url, {
            grant_type: "refresh_token",
            refresh_token: refreshToken
        });
        console.log(response.data);
        const { id_token, refresh_token } = response.data;
        res.status(200).json({ token: id_token, refreshToken: refresh_token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { refreshToken };
