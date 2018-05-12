var express 			 = require("express"),
	bodyParser 			 = require("body-parser"),
	mongoose 			 = require("mongoose"),
	methodOverrite 		 = require("method-override"),
	flash			     = require("connect-flash"),
	Campground 			 = require("./models/campground"),
	Comment 			 = require("./models/comment"),
	seedDB				 = require("./seeds"),
	passport			 = require("passport"),
	LocalStrategy 		 = require("passport-local"),
	passportLoalMongoose = require("passport-local-mongoose"),
	User				 = require("./models/user"),
	app 				 = express();

app.use(require("express-session")({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false
}));

app.use(flash());
app.use(methodOverrite("_method"));

var commentRoutes 	 = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes 		 = require("./routes/auth");

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(process.env.DATAURL);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// seedDB();

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(authRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Server started");
});