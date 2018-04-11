const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PointSchema = new Schema({
  type: {
    type: String,
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    index: '2dsphere'
  }
});

const DriverSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required.'],
  },
  driving: {
    type: Boolean,
    default: false,
  },
  geometry: PointSchema,    // this is embedded resource
});

const Driver = mongoose.model('Driver', DriverSchema);

module.exports = Driver;
