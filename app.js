const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

//TEMPLATE ENGINE SETTINGS
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

const { Collection } = require("mongoose");
const { Store } = require("express-session");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));


//DB CONNECTION
require("./config/databaseConnection");
const MongoDBStore = require("connect-mongodb-session")(session);

const sessionStore = new MongoDBStore({
    uri: process.env.MONGODB_CONNECTION_STRING,
    collection: "mySessions"
})


//SESSION AND FLASH-MESSAGE
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    },
    store: sessionStore
}));

app.use(flash());

app.use((req,res,next) => {
    res.locals.validation_error = req.flash("validation_error");
    res.locals.success_message = req.flash("success_message");
    res.locals.email = req.flash("email");
    res.locals.name = req.flash("name");
    res.locals.surname = req.flash("surname");
    res.locals.password = req.flash("password");
    res.locals.repassword = req.flash("repassword");

    res.locals.login_error = req.flash("error");

    next();
})

app.use(passport.initialize());
app.use(passport.session());

//INCLUDE ROUTERS
const authRouter = require("./routes/authRoute");
const roomRouter = require("./routes/roomRoute");
const adminRouter = require("./routes/adminRoute");

//FORM
app.use(express.urlencoded({extended: true}));
app.use(express.json({extended: true}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

//ROUTES
app.use("/", authRouter);
app.use("/rooms", roomRouter);
app.use("/admin", adminRouter);

app.listen(process.env.PORT, () => {
    console.log(`server run on ${process.env.PORT}`)
});