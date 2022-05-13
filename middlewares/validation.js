const { check } = require("express-validator");

const Validation = {
    signupValidationCheck : [
        check("email", "please provide a valid email").isEmail(),
        check("password", "please provide a password length minimum eight.").isLength({ min: 6 })
    ]
}

module.exports = Validation;
