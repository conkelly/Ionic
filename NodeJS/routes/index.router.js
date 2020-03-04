const express = require('express'); 
const router = express.Router();
const ctrlUser = require('../controllers/user.controller');
const jwtHelper = require('../config/jwtHelper');
var passport = require('passport');

router.post('/register', ctrlUser.register);
router.post('/authenticate',ctrlUser.authenticate);
router.post('/req-reset-password', ctrlUser.ResetPassword);
router.post('/new-password', ctrlUser.NewPassword);
router.post('/valid-password-token', ctrlUser.ValidPasswordToken);
router.post('/companies',/*jwtHelper.verifyJwtToken,*/ctrlUser.userProfile);

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });
  
  

module.exports = router;