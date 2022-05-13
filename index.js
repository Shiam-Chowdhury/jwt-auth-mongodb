const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todos = require('./routes/todosHandler');
const user = require('./routes/userHandler');

//to initialize express app
const app = express();
dotenv.config();
app.use(express.json());

//database connection with mongoose
mongoose.connect('mongodb://localhost:27017/todos')
    .then(() => {
        console.log('successfully connected to database');
    }).catch(err => console.log(err));

app.use('/todo', todos);
app.use('/user', user);

const errorHandler = (err, req, res, next) => {
    if(res.headersSent){
        return next(err);
    }
    res.status(500).json({error: err});
}

app.use(errorHandler);

app.listen(4000, () => {
    console.log('app running on port 4000');
})