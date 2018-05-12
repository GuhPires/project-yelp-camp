var Campground = require("../models/campground"),
	Comment    = require("../models/comment"); 

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCamp){
			if(err || !foundCamp) {
				req.flash("error", "Campground not found.");
				res.redirect("back");
			} else {
				if(req.user._id.equals(foundCamp.author.id)){
					return next();
				} else {
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You must be Logged In to do that.");
		res.redirect("/login");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment) {
				req.flash("error", "Comment not found.");
				res.redirect("back");
			} else {
				if(req.user._id.equals(foundComment.author.id)){
					return next();
				} else {
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You must be Logged In to do that.");
		res.redirect("/login");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash("error", "You must be Logged In to do that.");
		res.redirect("/login");
	}
}

module.exports = middlewareObj;