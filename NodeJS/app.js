const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
var employeeController = require('./controllers/employeeController.js');
var userController = require('./controllers/user.controller.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const rtsIndex = require('./routes/index.router');
var morgan = require('morgan');

require('./config/config');
require('./models/db');
require('./config/passportConfig');
require('async');


var app = express();


app.use(express.static('public')); 
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/authenticate', passport.authenticate('jwt', {session: false}), rtsIndex);
app.use('/api',rtsIndex);
app.use('/employees', employeeController);
app.use('/register', rtsIndex);
app.use('/authenticate', rtsIndex);
app.use('/req-reset-password',rtsIndex); 
app.use('/new-password',rtsIndex);
app.use('/valid-password-token',rtsIndex);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static('www'));
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Methods","DELETE, PUT");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use((err, req, res, next) => {
    if (err.name === 'ValidationError'){
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors);}});

app.get("/", function(req,res){
    res.sendFile(process.cwd()+'/public/index.html');
})

mongoose.Promise = global.Promise;
app.listen(process.env.PORT,() => console.log(`Server started at port : ${process.env.PORT} `));