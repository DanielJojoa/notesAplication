var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../../models/Users');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/configJWT');
var VerifyToken = require('../auth/VerifyToken');

router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    const errors = [];

    if (password !== password2) { errors.push({ text: 'Please write the same password' }) };
    if (password.length < 4) { errors.push({ text: 'Password too short, it must be larger than 4 characters.' }) };
    if (errors.length > 0) {
        res.json({errors, name, email, password, password2 });
    }else{
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            res.json({status:'error',msg:'The email already exist'});
        } else {
            
            try {
                const newUser = new User({ name, email, password });
                newUser.password = await newUser.encryptPassword(password);

                const user = await newUser.save();

                // create a token
                var token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });


                res.json({ status: 'success', msg: `User ${name} created`, token: token });
            } catch (error) {
                res.json({status:'error',msg:'Error in server',msg:'Can not create the user'});
            }
         
        }
    }
    
});


router.post('/login', async (req, res)=> {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.json({ status: 'error', msg: 'Error, User Not Found.' });;
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.json({ status: 'error', token: null ,msg:'Password Invalid'});
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.json({ auth: true, token: token });
    } catch (error) {
        if (err) return res.json({status:'error',msg:'Error on the server.'});

    }
    

});


router.post('/logout', function (req, res) {
    res.json({ auth: false, token: null });
});

router.post('/me', VerifyToken, function (req, res, next) {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.json({status:'error',msg:"There was a problem finding the user."});
        if (!user) return res.json({ status: 'error', msg: "User not found" });
        res.json({stastus:'success',user});
    });
});
// add this to the bottom of AuthController.js
module.exports = router;