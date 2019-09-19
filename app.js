require('dotenv').config();

var express    = require("express");
var	app        = express();
var	bodyParser = require("body-parser");
var	mongoose   = require("mongoose");
var	flash       = require("connect-flash");
app.locals.moment = require('moment');
var	passport   = require("passport");
var	LocalStrategy = require("passport-local");
var	methodOverride = require("method-override");
var	Campground = require("./models/campground");
var	Comment    = require("./models/comments");
var	User       = require("./models/user");
var	seedDB     = require("./seeds");
	

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/yelp-camp_v11", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes      = require("./routes/index")

app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes)

app.listen(3000, function(){
	console.log("YelpCamp has Started!");
})