const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var app = express();
var { Employee } = require('../models/employee');
var passport = require('passport');
var jwtDecode = require('jwt-decode');



// => localhost:3000/employees/
router.get('/',   (req, res) => {
    var ID = jwtDecode(req.headers['authorization'].split(' ')[1])._id;
    if (jwtDecode(req.headers['authorization'].split(' ')[1]).rol == "User"){
       
    Employee.find((err, docs) => {
        if (!err) { //console.log( docs ); 
            res.send(docs); }
        else { console.log('Error in Retriving Employees :' + JSON.stringify(err, undefined, 2)); }
    }).where('user').equals(ID)} else {
        Employee.find((err, docs) => {
            if (!err) { //console.log( docs ); 
                res.send(docs); }
            else { console.log('Error in Retriving Employees :' + JSON.stringify(err, undefined, 2)); }
        })
    } 
});



app.use('/', passport.authenticate('jwt',{session: false}), require('../routes/index.router.js'));

router.get('/:id', /* passport.authenticate('jwt', {session: false}),*/ (req, res) => { //auth => headerless get.
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Employee :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', /* passport.authenticate(['oauth2-jwt-bearer'], {session: false}) ,*/ (req, res) => { //headerless post request.
    console.log(req.body.token);
    var emp = new Employee({
        address: req.body.address,
        companyname: req.body.companyname,
        zipcode: req.body.zipcode,
        email: req.body.email,
        phone: req.body.phone,
        website: req.body.website,
        description: req.body.description,
        user: req.body.user,
    });
    emp.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Employee Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var emp = {
        address: req.body.address,
        companyname: req.body.companyname,
        zipcode: req.body.zipcode,
        email: req.body.email,
        phone: req.body.phone,
        website: req.body.website,
        description: req.body.description,
        user: req.body.user,
    };
    Employee.findByIdAndUpdate(req.params.id, { $set: emp }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Employee Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Employee Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;