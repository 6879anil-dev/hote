//oturumun açık olduğunu kontrol eder
const sessionOpened = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error", ["Please sign in"]);
        res.redirect("/login");
    }
}

//oturumun açık olmadığını kontrol eder
const sessionNotOpened = function(req,res,next){
    if(!req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/user/coins");
    }
}

//admin olduğunu kontrol eder
const isAdminControl = function(req,res,next){
    try {
        
        if(req.user.isAdmin == true){
            return next();
        } else {
            res.redirect("/user");
        }

    } catch (err) {
        
    }
}

module.exports = {
    sessionOpened,
    sessionNotOpened,
    isAdminControl
}