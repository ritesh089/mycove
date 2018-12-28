const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

var swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');


// Connecting to the database
mongoose.connect(dbConfig.url, dbConfig.options).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});
mongoose.set('useCreateIndex', true);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
var options = {
  swaggerOptions: {
    authAction: {
      JWT: {
        name: "JWT",
        schema: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: ""
        },
        value: "Bearer <JWT>"
      }
    }
  }
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', "PUT, POST, PATCH, DELETE");
    return res.status(200).json({})
  }
  next();
})
app.get('/', (req, res, next) => {
  res.json({
    message: 'Users api is up and running'
  });
});
require('./routes/user.routes.js')(app);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
})



module.exports = app;
