const router = require('express').Router();
const User = require('../models/Users');
const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});
router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});
router.post('/users/signup', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    const errors = [];

    if (password !== password2) { errors.push({ text: 'Please write the same password' }) };
    if (password.length < 4) { errors.push({ text: 'Password too short, it must be larger than 4 characters.' }) };
    if (errors.length > 0) {
        res.render('users/signup', { errors, name, email, password, password2 });
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('error_msg', 'The Email is already in use.');
            res.redirect('/users/signup');
        } else {
            // Saving a New User
            const newUser = new User({ name, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You are registered.');
            res.redirect('/users/signin');
        }
    }

});
router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
  }));
  router.get('/user/logout',(req,res)=>{
      req.logOut();
      res.redirect('/');
  });
  

module.exports = router;