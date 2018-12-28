const User = require('../models/user.js');
const mongoose = require('mongoose');
const {
  validationResult
} = require('express-validator/check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// Create and Save a new User
exports.create = (req, res, next) => {
  console.log(req.body)

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  if (!req.body) {
    return res.status(400).send({
      message: "User  cannot be empty"
    });
  }

  //Validate request data


  User.find({
    email: req.body.email
  }).exec().
  then(user => {

    if (user.length >= 1) {
      return res.status(422).json({
        message: "The email address is already Registered"
      })
    } else {
      // Create a User
      const user = new User(req.body);



      bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {

          user.password = hash
          user.save()
            .then(data => {
              res.status(201).json({
                message: "User created successfully",
                data: data
              })
            }).catch(err => {
              res.status(500).json({
                message: err.message || "Some error occurred while creating the User."
              });
            });
        }
      })
    }
  })

};



exports.login = (req, res, next) => {
    User.find({
      email: req.body.email
    }).exec().
    then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Login failed"
        })
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Login failed"
            })
          }
          if (result) {
            const token = jwt.sign({
              email: user[0].email,
              primaryPhone: user[0].primaryPhone
            },process.env.JWT_KEY,
          {
            expiresIn: "5m"
          });


            return res.status(200).json({

              message: "Login Successful",
              token: token
            })
          } else {
            return res.status(401).json({
              message: "Login failed"
            })
          }
        })

    }) .catch(err => {
        res.status(500).json({
          error: err
        })
      })
  }

    // Retrieve and return all users from the database.
    exports.findAll = (req, res, next) => {
      User.find({}, {
          password: 0,
          oneTimePasswordInd: 0
        }).exec()
        .then(users => {
          res.json(users);
        }).catch(err => {
          res.status(500).json({
            message: err.message || "Some error occurred while retrieving users."
          });
        });
    };

    // Find a User  with a username
    exports.findOne = (req, res, next) => {
      User.find({
          email: req.params.username
        }, {
          password: 0
        })
        .then(user => {
          if (!user) {
            return res.status(404).send({
              message: "User not found with username " + req.params.username
            });
          }
          res.send(user);
        }).catch(err => {
          if (err.kind === 'ObjectId') {
            return res.status(404).send({
              message: "User not found with username " + req.params.username
            });
          }
          return res.status(500).send({
            message: "Error retrieving User with username " + req.params.username
          });
        });
    };

    exports.delete = (req, res, next) => {
      const id = req.params._id;
      console.log(id);
      User.remove({
        _id: id
      }).exec().then(result => {
        res.status(200).json(result);
      }).catch(err => {
        res.status(500).json({
          error: err
        })
      });
    }
