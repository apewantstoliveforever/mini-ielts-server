//authorization.js
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const db = mysql.createConnection({
    
    });

//protect route for user, role

exports.protect = async (req, res, next) => {
    try {
        //1) Getting token and check of it's there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'You are not logged in! Please log in to get access.'
            });
        }

        //2) Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        //3) Check if user still exists
        const currentUser = await db.promise().query(
            'SELECT * FROM user WHERE user_id = ?',
            [decoded.id]
        );

        if (!currentUser) {
            return res.status(401).json({
                status: 'fail',
                message: 'The user belonging to this token does no longer exist.'
            });
        }

        //4) Check if user changed password after the token was issued
        // if (currentUser.changedPasswordAfter(decoded.iat)) {
        //     return res.status(401).json({
        //         status: 'fail',
        //         message: 'User recently changed password! Please log in again.'
        //     });
        // }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser[0][0];
        next();
    } catch (err) {
        console.log(err);
    }
}