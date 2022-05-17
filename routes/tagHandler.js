const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const tutorialSchema = require('../schemas/tutorialSchema');
const tagSchema = require('../schemas/tagSchema');
const Tutorial = new mongoose.model('Tutorial', tutorialSchema);
const Tag = new mongoose.model('Tag', tagSchema);

//to get all tags with corresponding tutorials
router.get('/all', (req, res) => {
    Tag.find({}).populate("tutorials", "-__v").exec((err, data) => {
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
})

//this route is responsible for creating a single tutorial
router.post('/', async (req, res) => {
    try { 
        // here I use create() function, this is an alternative ...
        // ...to new Model and save() function
        const tag = await Tag.create(req.body);

        res.status(200).json({
            tag,
            message: 'new tag is created!'
        })
    } catch(error) {
        res.status(500).json({
            error,
            message: 'server error!'
        });
    }
});


//adding a tutorial to a tag
router.put('/add-tutorial-to-tag/:id', async (req, res) => {
    try {
        const tag = await Tag.findOneAndUpdate({
            _id: req.params.id
        }, {
            $push: { tutorials: req.body.tutorialId}
        }, { new: true });

        res.status(200).json({
            tag,
            message: 'new tutorial added to a tag!'
        });
    } catch (error) {
        res.status(500).json({
            error,
            message: 'server error!'
        });
    }
});

module.exports = router;
