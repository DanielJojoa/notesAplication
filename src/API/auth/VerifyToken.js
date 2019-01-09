var jwt = require('jsonwebtoken');
var config = require('../../config/configJWT');
function verifyToken(req, res, next) {
    
    if (!req.body.token)
        return res.json({ status:'error', msg: 'No token provided.' });
    jwt.verify(req.body.token, config.secret, function (err, decoded) {
        if (err)
            return res.json({ status:'error', message: 'Failed to authenticate token.',error });
        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
}
module.exports = verifyToken;