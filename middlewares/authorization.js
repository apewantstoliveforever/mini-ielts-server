//authorization.js

const adminArray = ["foreveralone1608@gmail.com", "admin@gmail.com"]

const AdminRole = (req, res, next) => {
    const email = req.user.email
    console.log(email)
    if (adminArray.includes(email)) {
        req.user.role = 'admin'
        next()
    } else {
        res.status(401).send('Unauthorized')
    }
}

module.exports = { AdminRole }