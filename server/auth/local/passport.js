var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User, config) {
	passport.use(new LocalStrategy({
			usernameField: 'name',
			passwordField: 'password' // this is the virtual field on the model
		},
		function (name, password, done) {
			User.findOne({
				name: name.toLowerCase()
			}, function (err, user) {
				if(err) return done(err);

				if(!user) {
					return done(null, false, {
						field: 'name',
						message: 'Username is not yet registered.'
					});
				}
				if(!user.authenticate(password)) {
					return done(null, false, {
						field: 'password',
						message: 'Incorrect password, please try again.'
					});
				}
				return done(null, user);
			});
		}
	));
};
