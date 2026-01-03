const passport_local = require("../config/passportLocal");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/userModel"); 
const bcrypt = require("bcrypt");

module.exports = function(passport) {
    
    const options = {
        usernameField: "email",
        passwordField: "password"
    };

    passport.use(new LocalStrategy(options, async (email, password, done)=>{

        try {
            const _foundUser = await User.findOne({email: email})

            if(!_foundUser){
                return done(null, false, {message: "User cant found"});
            }

            const controlPassword = await bcrypt.compare(password, _foundUser.password);
            
            if(!controlPassword){
                return done(null, false, {message: "Password incorrect"});
            } else{
                if(_foundUser && _foundUser.emailActive == false){
                    return done(null, false, {message: "Please confirm your email"});
                } else {
                    return done(null, _foundUser);
                }
            }
            
        } catch (err) {
            return done(err);
        }

    }));

    passport.serializeUser(function(user, done){
        console.log("session saved: " + user.id);
        done(null, user.id);
    });

    passport.deserializeUser( function(id, done){
        console.log("session id found");
        const saveid = async function(err){
            const _user = await User.findById(id);
            const _thisUser = {
                id: _user.id,
                name: _user.name,
                email: _user.email,
                username: _user.name,
                tc: _user.tc,
                phone: _user.phone,
                address: _user.address,
                gun: _user.gun,
                baslangic: _user.baslangic,
                bitis: _user.bitis
            }
            done(err, _thisUser);
        }
        saveid();
    });

}