const jwt = require('jsonwebtoken');

const checkLogin = (req, res, next) => {

    const { authorization } = req.headers;

    try {
        //to get token part from req headers.authorization as
        //it has bearer part too.
        const token = authorization.split(' ')[1];
        //testing weather a user has send valid token or not
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email, userId } = decoded;
        req.email = email;
        req.userId = userId;
        next();
    } catch {
        next('authentication failure!');
    }
}

module.exports = checkLogin;