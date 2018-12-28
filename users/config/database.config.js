module.exports = {
    url: 'mongodb://18.191.116.13:27017/mycove',
    options : {
      useNewUrlParser: true,
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      user: "dbuser",
      pass: "password"
    }
}
