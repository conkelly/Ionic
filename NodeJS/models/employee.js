const mongoose = require('mongoose');

var SquiggleBop = new mongoose.Schema({
    address: {
        type: String,
        required: 'Address can\'t be empty'
    }, 
    companyname: {
        type: String,
        required: 'Company name can\'t be empty', 
    }, 
    zipcode: {
        type: String,
        required: 'Zip code can\'t be empty',
    }, 
    email: {
        type: String,
        required: 'Email can\'t be empty'
    }, 
    phone: {
        type: String,
        required: 'Phone can\'t be empty' 
    }, 
    website: {
        type: String,
        required: 'Website can\'t be empty',
    }, 
    description: {
        type: String,
        required: 'Description can\'t be empty',
    }, 
    user: {type: String, }
}); 

SquiggleBop.path('email').validate((val) => { 
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val); 
}, 'Invalid e-mail.');

SquiggleBop.path('phone').validate((val) => { 
    phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
    return phoneRegex.test(val);  
}, 'Invalid phone.');

SquiggleBop.path('website').validate((val) => { 
    websiteRegex = /^[a-zA-Z0-9\-\.]+\.(com|org|net|mil|edu|COM|ORG|NET|MIL|EDU)$/;
    return websiteRegex.test(val);  
}, 'Invalid website.');

SquiggleBop.path('zipcode').validate((val) => { 
    zipRegex = /^\d{5}$/;
    return zipRegex.test(val);  
}, 'Invalid phone.');


Employee = mongoose.model('Employee', SquiggleBop);

module.exports = { Employee };