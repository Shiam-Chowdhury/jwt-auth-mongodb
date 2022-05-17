const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const tutorialSchema = require('../schemas/tutorialSchema');
const tagSchema = require('../schemas/tagSchema');
const Tutorial = new mongoose.model('Tutorial', tutorialSchema);
const Tag = new mongoose.model('Tag', tagSchema);

//to get all tutorials with tags
router.get('/all', (req, res) => {
    Tutorial.find({}).populate("tags").exec((err, data) => {
        if(err){
            res.status(500).json({
                err,
                error: 'internal server error!'
            })
        }else{
            res.status(200).json({
                result: data
            })
        }
    });
});

//this route is responsible for creating a single tutorial
router.post('/', async (req, res) => {
    try { 
        //here I use create() function, this is an alternative ...
        // ...to new Model and save() function
        const tutorial = await Tutorial.create(req.body);

        res.status(200).json({
            tutorial,
            message: 'new tutorial is created!'
        })
    } catch(error) {
        res.status(500).json({
            error,
            message: 'server error!'
        });
    }
});

//this is responsible for adding a tag to a tutorial
router.put('/add-tag-to-tutorial/:id', async (req, res) => {
    try {
        const tutorial = await Tutorial.findOneAndUpdate({
            _id: req.params.id
        }, {
            $push: { tags: req.body.tagId}
        }, { new: true});

        res.status(200).json({
            tutorial,
            message: 'new tag added to a tutorial!'
        });
    } catch (error) {
        res.status(500).json({
            error,
            message: 'server error!'
        });
    }
});

module.exports = router;
