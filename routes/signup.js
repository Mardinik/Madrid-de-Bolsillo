var express = require('express');
var router = express.Router();
const passport = require("passport");

/* GET users listing. */

	// signup view
	router.get('/', (req, res) => { //por ahora no tenemos view de signup, por lo que no funciona el "get /"
		res.render('signup', {
			message: req.flash('signupMessage')
		});
	});

	router.post('/', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup', //por ahora no tenemos view de signup, por lo que no funciona el redirect
		failureFlash: true // allow flash messages
	}));
	
module.exports = router;