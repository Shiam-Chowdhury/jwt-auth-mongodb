const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const todoSchema = require('../schemas/todoSchema');
const userSchema = require('../schemas/userSchema');
const Todo = new mongoose.model('Todo', todoSchema);
const User = new mongoose.model('User', userSchema);
const checkLogin = require('../middlewares/checkLogin');

router.get('/', checkLogin, (req, res) => {
    Todo.find({ status: 'active'}, (err, data) => {
        if(err){
            res.status(500).json({
                error: 'internal server error!'
            })
        }else{
            res.status(200).json({
                result: data,
            })
        }
    })
});

router.get('/todos-met_chain', (req, res) => {
    Todo.find({ status: 'active'}).populate("user", "-_id -__v").select({
        _id: 0,
        date: 0,
        __v: 0,
    }).exec((err, data) => {
        if(err){
            res.status(500).json({
                error: 'internal server error!'
            })
        }else{
            res.status(200).json({
                result: data,
            })
        }
    });
});

router.get('/:id', (req, res) => {

});

router.post('/', checkLogin, async (req, res) => {
    try {
        const newTodo = new Todo({
            ...req.body,
            user: req.userId
        });

        const todo = await newTodo.save();

        await User.updateOne({
            _id: req.userId
        },{
            $push: {
                todos: todo._id
            }
        });

        res.status(200).json({
            message: 'todo created successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            error,
            message: 'server error!'
        });
    }
});

router.post('/all', (req, res) => {
    Todo.insertMany(req.body, (err) => {
        if(err){
            res.status(500).json({
                error: 'internal server error'
            })
        }else{
            res.status(200).json({
                success: 'todos created successfully'
            })
        }
    })
});

router.put('/:id', async (req, res) => {
    // Todo.updateOne({_id: req.params.id}, {
    //     $set: {
    //         status: 'inactive'
    //     }, 
    // }, (err) => {
    //     if(err){
    //         res.status(500).json({
    //             error: 'internal server error'
    //         })
    //     }else{
    //         res.status(200).json({
    //             success: 'todo updated successfully'
    //         })
    //     }
    // })
    // try {
    //     const UpdatedData = await Todo.findOneAndUpdate(
    //         {   _id: req.params.id  },
    //         {
    //             $set: {
    //                 status: 'active'
    //             },
    //         },
    //         {
    //             new: true
    //         }, 
    //         (err) => {
    //             if(err){
    //                 res.status(500).json({
    //                     error: 'internal server error'
    //                 })
    //             }else{
    //                 res.status(200).json({
    //                     todo: UpdatedData,
    //                     success: 'todo updated successfully'
    //                 })
    //             }
    //         }
    //     )
    //     Todo.save();
    // } catch (error) {
    //     console.log(error);
    // }

    try {
        const todo =  await Todo.findOneAndUpdate({
            _id: req.params.id
        }, req.body, { new: true} );

        res.status(200).json({
            todo,
            success: 'updated successfully'
        });
       } catch (error) {
         res.status(500).send(error);
       }
});

router.delete('/:id', (req, res) => {
    Todo.deleteOne({_id: req.params.id},  (err) => {
        if(err){
            res.status(500).json({
                error: 'internal server error'
            })
        }else{
            res.status(200).json({
                success: 'todo deleted successfully'
            })
        }
    })
});

module.exports = router;