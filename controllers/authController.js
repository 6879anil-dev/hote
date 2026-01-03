const {validationResult} = require("express-validator");
const axios = require("axios");
const User = require("../models/userModel");
const passport = require("passport");
require("../config/passportLocal")(passport);

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const showHomePage = (req,res,next) => {
    res.render("home", {
        user: req.user
    });
}

//LOGIN
const loginForm = (req,res,next) => {
    res.render("login");
}
const login = (req,res,next) => {
    const errors = validationResult(req);

    req.flash("email", req.body.email);
    req.flash("password", req.body.password);

    if(!errors.isEmpty()){
        req.flash("validation_error", errors.array());
        res.redirect("/login");
    }else{
        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/login",
            failureFlash: true
        })(req,res,next);
    }
}

//REGISTER
const registerForm = (req,res,next) => {
    res.render("register");
}
const register = async (req,res,next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        req.flash("validation_error", errors.array());
        req.flash("email", req.body.email);
        req.flash("name", req.body.name);
        req.flash("password", req.body.password);
        req.flash("repassword", req.body.repassword);

        res.redirect("/register");
    }
    else{

        try {
            const _user = await User.findOne({email: req.body.email});
            const _username = await User.findOne({name: req.body.name});

            if(_username){
                req.flash("validation_error", [{msg: "username is not available"}]);
                req.flash("email", req.body.email);
                req.flash("name", req.body.name);
                req.flash("password", req.body.password);
                req.flash("repassword", req.body.repassword);
                res.redirect("/register");
            }
            if(_user && _user.emailActive == true){
                req.flash("validation_error", [{msg: "mail is not available"}]);
                req.flash("email", req.body.email);
                req.flash("name", req.body.name);
                req.flash("password", req.body.password);
                req.flash("repassword", req.body.repassword);
                res.redirect("/register");
            }
            else if( (_user && _user.emailActive == false) || _user == null) {

                if(_user){
                    await User.findByIdAndRemove({_id: _user._id});
                }

                const _newUser = new User({
                    email: req.body.email,
                    name: req.body.name,
                    password: await bcrypt.hash(req.body.password, 10)
                });

                await _newUser.save();
            

                //JWT
                const jwtInfo = {
                    id: _newUser.id,
                    mail: _newUser.email
                }

                const jwtToken = jwt.sign(jwtInfo, process.env.CONFIRM_MAIL_JWT_SECRET, {expiresIn: "1d"});

                
                //SEND EMAIL
                
                const confirmUrl = process.env.WEBSITE_URL + "verify?id=" + jwtToken;

                let transporter = nodemailer.createTransport({
                    host: 'smtp.hostinger.com',
                    port: 465,
                    secure: true, // true for 465, false for other ports
                    auth: {
                      user: '', // your domain email address
                      pass: process.env.PASSWORD // your password
                    }
                });

                await transporter.sendMail({
                    from: "Hotel <noreply@Hotel.com>",
                    to: _newUser.email,
                    subject: "noreply - Confirm Your Mail",
                    text: "Please click this link to confirm your mail: \n " + confirmUrl
                }, (error, info) => {
                    if(error){
                        console.log(error);
                    }
                    transporter.close();
                });
                
                
                
                req.flash("success_message", [{msg: "Check your mailbox and confirm your mail"}]);
                res.redirect("/login");
            }
        } catch (err) {
            console.log(err);
        }

    }
}

//FORGET PASSWORD
const forgetPasswordForm = (req,res,next) => {
    res.render("forgotpassword");
}
const forgetPassword = async (req,res,next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        req.flash("validation_error", errors.array());
        req.flash("email", req.body.email);

        res.redirect("/forgotpassword");
    } 
    //burası çalışırsa kullanıcı düzgün mail girmiştir
    else {
        try {
            const _user = await User.findOne({email: req.body.email, emailActive: true});

            if(_user) {
                //send reset password mail to user

                const jwtInfo = {
                    id: _user.id,
                    mail: _user.email
                };
                const secret = process.env.RESET_PASSWORD_SECRET + "-" + _user.password;
                const jwtToken = jwt.sign(jwtInfo, secret, {expiresIn: "1d"});

                const url = process.env.WEBSITE_URL + "resetpassword/" + _user.id + "/" + jwtToken;

                let transporter = nodemailer.createTransport({
                    host: 'smtp.hostinger.com',
                    port: 465,
                    secure: true, // true for 465, false for other ports
                    auth: {
                      user: '', // your domain email address
                      pass: process.env.PASSWORD // your password
                    }
                });

                await transporter.sendMail({
                    from: "Hotel <noreply@Hotel.com>",
                    to: _user.email,
                    subject: "Reset Password",
                    text: "Please click this link to reset your password: " + url
                }, (error, info) => {
                    if(error){
                        console.log(error);
                    }
                    transporter.close();
                });
                
                req.flash("success_message", [{msg: "Check your mailbox and confirm your mail"}]);
                res.redirect("/login");

            } else {
                req.flash("validation_error", [{msg: "mail is not active"}]);
                req.flash("email", req.body.email);
                res.redirect("/forgotpassword");
            }


                
            
        } catch (err) {
            
        }

    }

    //res.render("forget_password", {layout: "./layouts/auth_layout.ejs"});
}

//LOGOUT
const logOut = (req,res,next) => {
    req.logout(req.user, err => {
        req.session.destroy((error) => {
            res.clearCookie("connect.sid");
            res.render("login", {success_message: [{msg: "session ended"}]});
        });
    });
}

//VERIFYMAIL
const verifyMail = (req,res,next) => {
    const token = req.query.id;
    if(token){

        try {
            jwt.verify(token, process.env.CONFIRM_MAIL_JWT_SECRET, async (err,decode) => {
                if(err){
                    req.flash("error", "token incorrect or expired");
                    res.redirect("/login");
                } else {
                    const tokenId = decode.id;
                    const result = await User.findByIdAndUpdate(tokenId, {emailActive: true});

                    if(result){
                        req.flash("success_message", [{msg: "Mail confirmed"}]);
                        res.redirect("/login");
                    } else {
                        req.flash("error", "Please register again");
                        res.redirect("/login");
                    }
                }
            });
        } catch (err) {
            
        }

    }else{
        req.flash("error", "token incorrect or expired");
        res.redirect("/login");
    }
}

//NEWPASSWORD
const newPasswordForm = async (req,res,next) => {

    const link_id = req.params.id;
    const link_token = req.params.token;

    if(link_id && link_token){
            
            const _foundUser = await User.findOne({ _id: link_id });
            console.log(_foundUser);

            const _secret = process.env.RESET_PASSWORD_SECRET + "-" + _foundUser.password;

            try {
                jwt.verify(link_token, _secret, async (err,decode) => {
                    if(err){
                        req.flash("error", "link can't found or expired");
                        console.log(err);
                        res.redirect("/forgotpassword");
                    } else {
                        
                        res.render("resetpassword", {id: link_id, token: link_token});

                    }
                });
            } catch (err) {
                
            }
        
    } else {
        req.flash("validation_error", [{msg: "please click link in your mailbox"}]);
        req.flash("email", req.body.email);
        res.redirect("/forgotpassword");
    }
} 
const saveNewPassword = async (req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        req.flash("validation_error", errors.array());
        req.flash("error", "go brr");

        res.redirect("/resetpassword/" + req.body.id + "/" + req.body.token);
    } else {

        const _foundUser = await User.findOne({ _id: req.body.id, emailActive: true });

        const _secret = process.env.RESET_PASSWORD_SECRET + "-" + _foundUser.password;

        try {
            jwt.verify(req.body.token, _secret, async (err,decode) => {
                if(err){
                    req.flash("error", "link can't found or expired");
                    console.log(err);
                    res.redirect("/forgotpassword");
                } else {
                    
                    //SAVE NEW PASSWORD
                    const hashedPassword = await bcrypt.hash(req.body.password, 10);

                    const result = await User.findByIdAndUpdate(req.body.id, { password: hashedPassword });

                    if(result){
                        req.flash("success_message", [{msg: "Password Changed"}]);
                        res.redirect("/login");
                    } else {
                        req.flash("error", "Password Couldn't Change");
                        res.redirect("/login");
                    }

                }
            });
        } catch (err) {
            
        }
    }
}


module.exports = {
    showHomePage,
    loginForm,
    login,

    registerForm,
    register,

    forgetPasswordForm,
    forgetPassword,

    logOut,
    verifyMail,

    newPasswordForm,
    saveNewPassword
}