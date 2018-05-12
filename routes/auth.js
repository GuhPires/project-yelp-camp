var express    = require("express"),
	middleware = require("../middleware"), 
	Campground = require("../models/campground"),
	Comment    = require("../models/comment"),
	User 	   = require("../models/user"),
	passport   = require("passport"),
	router     = express.Router();

router.get("/", function(req, res){
	res.render("landing.ejs");
});

router.get("/register", function(req, res){
	res.render("users/register.ejs");
});

router.get("/login", function(req, res){
	res.render("users/login.ejs");
});

router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message); 
			res.redirect("/register"); 
		} else {
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Successfully Signed Up as " + user.username + ".");
				res.redirect("/campgrounds");
			});
		}
	});
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds", 
	failureRedirect: "/login"
}), function(req, res){});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You Logged Out.");
	res.redirect("/campgrounds");
});

module.exports = router;