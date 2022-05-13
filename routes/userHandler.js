const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userSchema = require('../schemas/userSchema');
const User = new mongoose.model('User', userSchema);
const { validationResult } = require("express-validator");
const validation = require('../middlewares/validation');

router.post('/signup', validation.signupValidationCheck, async (req, res) => {
    try {
        const error = validationResult(req);

        if(!error.isEmpty()){
            res.status(500).json({
                error
            })
        }
        //hashing the requested password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //creating new user
        const newUser = new User({
            email: req.body.email,
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword
        });
        await newUser.save();

        res.status(200).json({
            message: 'signup successfull!'
        });
    } catch(err) {
        res.status(500).json({
            message: 'signup failed!',
            err
        });
    }
});

router.post('/signin', async (req,res) => {
    const user = await User.findOne({ email: req.body.email});

    if(user){
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);

        try {
            if(isValidPassword){
                const token = jwt.sign({
                    email: req.body.email,
                    userId: user._id
                },process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });
    
                res.status(200).json({
                    token,
                    message: 'login successfull'
                })
            }else{
                res.status(401).json({
                    message: 'login failed!',
                });
            }  
        } catch (error) {
            res.status(500).json({
                message: 'signin failed!',
                err
            });
        }

    }
});

router.get('/all', async (req, res) => {
    try {
        const users = await User.find({
            status: 'active'
        }).populate('todos').select({
            __v: 0
        });

        res.status(200).json({
            users
        });
    } catch {
        res.status(500).json({
            message: 'server error!',
        });
    }
})

module.exports = router;