const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const _ = require('lodash');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
var User = require('../models/user.model');

const passwordResetToken = require('../models/resettoken');
nodemailer.createTransport({ sendmail: true })



module.exports = {
  async register(req, res, next) {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.role = "User";
    user.save((err, doc) => {
      if (!err)
        res.send(doc);
      else {
        if (err.code == 11000)
          res.status(422).send(['Duplicate email address found.']);
        else
          return next(err);
      }
    });
  }, async authenticate(req, res, next) {
    passport.authenticate('local',{session:false}, (err, user, info) => {
      if (user.fullName === "Conor Edward Kelly")
        user.role = "Admin";
      else user.role = "User";
      console.log(user);
      if (err) return res.status(400).json(err);

      else if (user) return res.status(200).json({ "token": user.generateJwt(), "user": user }) ;


      //This is where 404 error is coming from...
      else return res.status(404).json(info);
    })(req, res);
  },
  async userProfile(req, res, next) { 
    User.findOne({ _id: req._id }, 
      (err,user)=> { 
        if (!user) 
          return res.status(404).json({status: false, message: 'User record not found.'});
        else
          return res.status(200).json({status: true, user: _.pick(user,['fullName','email', 'role'])});

      });
  },

  async CreateUser(req, res) {
    const userEmail = await User.findOne({
      email: req.body.email
    });
    if (userEmail) {
      return res
        .status(409)
        .json({ message: 'Email already exists' });
    }

    const userName = await User.findOne({
      username: req.body.fullName
    });
    if (userName) {
      return res
        .status(409)
        .json({ message: 'Username already exists' });
    }

    return bcrypt.hash(req.body.password, 12, (err, hash) => {
      if (err) {
        return res
          .status(400)
          .json({ message: 'Error hashing password' });
      }
      const body = {
        username: req.body.fullName,
        email: req.body.email,
        password: hash, 
        role: req.body.role
      };
      User.create(body)
        .then(user => {
          res
          res.status(201).json({ message: 'User created successfully', user });
        })
        .catch(() => {
          res
            .status(500)
            .json({ message: 'Error occured' });
        });
    });
  },

  async ResetPassword(req, res) {
    if (!req.body.email) {
      return res
        .status(500)
        .json({ message: 'Email is required' });
    }
    const user = await User.findOne({
      email: req.body.email
    });
    if (!user) {
      return res
        .status(409)
        .json({ message: 'Email does not exist' });
    }
    var resettoken = new passwordResetToken({ _userId: user._id, resettoken: crypto.randomBytes(16).toString('hex') });
    resettoken.save(function (err) {
      if (err) { return res.status(500).send({ msg: err.message }); }
      passwordResetToken.find({ _userId: user._id, resettoken: { $ne: resettoken.resettoken } }).remove().exec();
      res.status(200).json({ message: 'Reset Password successfully.' });
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 465,
        auth: {
          user: 'conoredwardkelly@gmail.com',
          pass: 'Hightechhigh1'
        }
      });

      var mailOptions = {
        to: user.email,
        from: 'conoredwardkelly@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://localhost:4200/reset/' + resettoken.resettoken + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }
      transporter.sendMail(mailOptions, (err, info) => {
      })
    })
  },


  async ValidPasswordToken(req, res) {
    if (!req.body.resettoken) {
      return res
        .status(500)
        .json({ message: 'Token is required' });
    }
    const user = await passwordResetToken.findOne({
      resettoken: req.body.resettoken
    });
    if (!user) {
      return res
        .status(409)
        .json({ message: 'Invalid URL' });
    }
    User.findOne({ _id: user._userId }).then(() => {
      res.status(200).json({ message: 'Token verified successfully.' });
    }).catch((err) => {
      return res.status(500).send({ msg: err.message });
    });
  },
  async NewPassword(req, res) {
    passwordResetToken.findOne({ resettoken: req.body.resettoken }, function (err, userToken, next) {
      if (!userToken) {
        return res
          .status(409)
          .json({ message: 'Token has expired' });
      }

      User.findOne({
        _id: userToken._userId
      }, function (err, userEmail, next) {
        if (!userEmail) {
          return res
            .status(409)
            .json({ message: 'User does not exist' });
        }
        return bcrypt.hash(req.body.newPassword, 12, (err, hash) => {
          if (err) {
            return res
              .status(400)
              .json({ message: 'Error hashing password' });
          }
          userEmail.password = hash;
          
          User.findByIdAndUpdate(userEmail._id, { $set: userEmail }, { new: true }, (err, doc) => {
            if (!err) {
    
              userToken.remove();
              return res.status(201).json({ message: 'Password reset successfully' });
            }
            else {
 
              return res.status(400).json({ message: 'Password can not reset.' });
            }
          });
        });
      });
    })
  }
}