const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  username: {
    type: String
  },
  password: String,
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true
  },
  alternateEmail: String,
  primaryPhone: String,
  workPhone: String,
  oneTimePasswordInd: Boolean,
  oneTimePassword: String,
  status: String,
  address: String,
  addressLine2: String,
  zipcode: String,
  state: String,
  city: String,
  country: String,
  emergencyContacts: [{
    name: String,
    relationship: String,
    phone: String
  }],
  properties: [{
    propertyId: String,
    role: String,
    status: String,
    startDate: Date,
    endDate: Date
  }],
  additionalInfo: Map

}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
