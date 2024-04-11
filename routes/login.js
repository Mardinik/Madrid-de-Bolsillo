var express = require('express');
var router = express.Router();
const passport = require("passport");

/* GET users listing. */
	
	// login view
	router.get('/', (req, res) => {
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		});
	});

	router.post('/', passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}));


module.exports = router;