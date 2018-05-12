var express    = require("express"),
	middleware = require("../middleware"),
	Campground = require("../models/campground"),
	Comment    = require("../models/comment"),
	User 	   = require("../models/user"),
	router     = express.Router({mergeParams: true});

router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		err ? console.log(err) : res.render("comments/newComment.ejs", {campground: campground});
	});
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		err || !foundCamp ? (req.flash("error", "Campground not found."), res.redirect("back")) : Comment.findById(req.params.comment_id, function(err, foundComment){
			err || !foundComment ? (req.flash("error", "Comment not found."), res.redirect("back")) : res.render("comments/editComment.ejs", {campground_id: req.params.id, comment: foundComment});
		});
	});
});

router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err); 
			res.redirect("/campgrounds");  
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong.");
					console.log(err);
				} else {
					// console.log(req.user._id);
					// console.log(req.user.username); 
					//console.log(comment);
					comment.author.username = req.user.username;
					comment.author.id = req.user._id;
					comment.save();
					//console.log(comment.author);
					campground.comments.push(comment.id);
					//console.log(campground.comments);
					campground.save();
					req.flash("success", "Successfully added comment."); 
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

router.put("/:comment_id", middleware.checkCommentOwnership,function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		err ? res.redirect("back") : res.redirect("/campgrounds/" + req.params.id);
	});
});

router.delete("/:comment_id", middleware.checkCommentOwnership,function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		err ? res.redirect("back") : (req.flash("success", "Successfully deleted comment."), res.redirect("/campgrounds/" + req.params.id));
	});
});

module.exports = router;