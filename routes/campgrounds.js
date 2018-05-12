var express    = require("express"),
	middleware = require("../middleware"),
	Campground = require("../models/campground"),
	Comment    = require("../models/comment"),
	User 	   = require("../models/user"),
	router     = express.Router();

router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		err ? console.log(err) : res.render("campgrounds/index.ejs", {campgrounds: allCampgrounds, currentUser: req.user});
	});
});

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/newCampground.ejs");
});

router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		err || !foundCamp ? (req.flash("error", "Campground not found."), res.redirect("back")) : res.render("campgrounds/show.ejs",{campground: foundCamp}); 
	});
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		res.render("campgrounds/editCampground.ejs", {campground: foundCamp});
	});
});

router.post("/", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: desc, author: author, price: price};
	Campground.create(newCampground, function(err, newCamp){
		err ? console.log(err) : (console.log(newCamp), res.redirect("/campgrounds")); 
	});
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
		err ? res.redirect("/campgrounds") : res.redirect("/campgrounds/" + req.params.id);
	});
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		err ? res.redirect("/") : res.redirect("/campgrounds");
	});
});

module.exports = router;