const {body} = require("express-validator");

const validateNewUser = () => {
    return [
        body("email")
            .trim()
            .isEmail().withMessage("Enter Valid Mail"),

        body("password")
            .trim()
            .isLength({min: 6}).withMessage("password can be at least 6 characters"),

        body("name")
            .trim()
            .isLength({max: 20}).withMessage("username can be up to 20 characters"),

        body("surname")
            .trim()
            .isLength({max: 20}).withMessage("username can be up to 20 characters"),

        body("repassword").trim().custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error("Passwords are not same!");
            }
            return true;
        })
    ];
}

const validateNewPassword = () => {
    return [
        body("password")
            .trim()
            .isLength({min: 6}).withMessage("password can be at least 6 characters"),

        body("repassword").trim().custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error("Passwords are not same!");
            }
            return true;
        })
    ];
}

const validateLogin = () => {
    return [
        body("email")
            .trim()
            .isEmail().withMessage("Enter Valid Mail"),

        body("password")
            .trim()
            .isLength({min: 6}).withMessage("password can be at least 6 characters"),
    ];
}

const validateEmail = () => {
    return [
        body("email")
            .trim()
            .isEmail().withMessage("Enter Valid Mail"),
    ];
}

module.exports = {
    validateNewUser,
    validateLogin,
    validateEmail,
    validateNewPassword
}