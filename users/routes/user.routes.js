module.exports = (app) => {
  const users = require('../controllers/user.controller.js');
  const {check } = require('express-validator/check');
  const multer = require('multer');
  const upload = multer();
  const checkAuth = require("../middleware/auth")

  // Create a new User
  app.post('/users',checkAuth, [
    check('email',"Please Enter a valid email").isEmail().normalizeEmail(),
    check('primaryPhone', "Please enter a valid phone number in the format XXX-XXX-XXXX").isMobilePhone("en-US")
  ], users.create);

 app.post('/users/login', users.login);
  // Retrieve all Users
  app.get('/users', users.findAll);

  // Retrieve a single User with username
  app.get('/users/:username', users.findOne);

  app.delete('/users/:_id', users.delete)


}
