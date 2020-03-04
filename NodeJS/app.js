const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
var employeeController = require('./controllers/employeeController.js');
var userController = require('./controllers/user.controller.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const rtsIndex = require('./routes/index.router');

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
app.use(express.static('public'));

const server = require('http').createServer(app);

// app.use(function(req,res, next){
//   //console.log(req.headers);
//   if (req.headers && req.headers.myHeaders && req.headers.myHeaders.token.split(' ')[0]==='JWT'){ //This is a get method.
//     jsonwebtoken.verify(req.headers.token.split(' ')[1], 'RESTFULAPIs', function(err,decode){ 
//       if (err) req.user = undefined; 
//         req.user = decode;
//         console.log(req.user);
//         //console.log(req.user);
//         //console.log("HI");
//         next();
//     });
//   } else {
//     req.user = undefined;
//     next();
//   }
//   console.log(req.user);
// }); This program was moved to jwtHelper.js

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