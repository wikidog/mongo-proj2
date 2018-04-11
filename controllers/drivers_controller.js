const Driver = require('../models/driver');

module.exports = {

  greeting(req, res) {
    res.send({ hi: 'there' });
  },

  // GET /api/drives
  //
  index(req, res, next) {
    // http://google.com/drivers?lng=80&lat=20
    const { lng, lat } = req.query;

    // https://docs.mongodb.com/manual/reference/operator/aggregation/geoNear/
    //
    Driver.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: 'dist.calculated',
          maxDistance: 200000,
          spherical: true
        }
      }
    ])
      .then(drivers => res.send(drivers))
      .catch(next);  // let the error handling function run
  },

  // POST /api/drives
  //
  create(req, res, next) {
    const driverProps = req.body;

    Driver.create(driverProps)
      .then(driver => res.send(driver))
      .catch(next);  // let the error handling function run
  },

  // PUT /api/drives/:id
  //
  edit(req, res, next) {
    const driverId = req.params.id;
    const driverProps = req.body;

    Driver.findByIdAndUpdate(driverId, driverProps)
      .then(() => Driver.findById(driverId))
      .then(driver => res.send(driver))
      .catch(next);  // let the error handling function run
  },

  // DELETE /api/drives/:id
  //
  delete(req, res, next) {
    const driverId = req.params.id;

    Driver.remove({ _id: driverId })
      .then(driver => res.status(204).send(driver))
      .catch(next);  // let the error handling function run
  },
};
