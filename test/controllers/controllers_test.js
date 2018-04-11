const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');

const Driver = mongoose.model('Driver');

const app = require('../../app');

describe('Drivers controller', () => {

  it('POST /api/drivers creates a new driver', done => {

    // count the drivers
    Driver.count()
      .then(count => {
        request(app)
          .post('/api/drivers')
          .send({ email: 'test@example.com' })  // this is not sending request
          .end((err, response) => {
            //
            // count again
            //
            Driver.count()
              .then(newCount => {
                assert(count + 1 === newCount);
                done();
              })
              .catch(e => console.log(e));
          });
      })
      .catch(e => console.log(e));
  });

  it('PUT /api/drivers/id edits an existing driver', done => {
    //
    // 1. create a driver, save it to db
    // 2. edit the driver, save it
    // 3. retrieve the driver, assert
    //
    const driver = new Driver({ email: 'test@example.com', driving: false });
    driver.save()
      .then(doc => {
        const driverId = doc._id;
        request(app)
          .put(`/api/drivers/${driverId}`)
          .send({ driving: true }) // this is not sending request
          .end((err, response) => {
            //
            // find the driver
            //
            Driver.findById(driverId)
              .then(doc => {
                assert(doc.driving === true);
                done();
              })
              .catch(e => console.log(e));
          });
      })
      .catch(e => console.log(e));
  });

  it('DELETE /api/drivers/id deletes an existing driver', done => {
    //
    // 1. create a driver, save it to db
    // 2. delete the driver,
    // 3. retrieve the driver, assert
    //
    const driver = new Driver({ email: 'test@example.com' });
    driver.save()
      .then(doc => {
        const driverId = doc._id;
        request(app)
          .delete(`/api/drivers/${driverId}`)
          .end((err, response) => {
            //
            // find the driver
            //
            Driver.findById(driverId)
              .then(doc => {
                assert(doc === null);
                done();
              })
              .catch(e => console.log(e));
          });
      })
      .catch(e => console.log(e));
  });

  it('GET /api/drivers finds drivers in a location', done => {
    //
    // we want to test:
    // 1. find some drivers
    // 2. maxDistance works
    //
    // test:
    // 1. create 2 drivers with different lngs and lats
    // 2. query the db
    //
    const seattleDriver = new Driver({
      email: 'seattle@example.com',
      geometry: { type: 'Point', coordinates: [-122.4759902, 47.6147628] }
    });

    const miamiDriver = new Driver({
      email: 'miami@example.com',
      geometry: { type: 'Point', coordinates: [-80.253, 25.791] }
    });

    Promise.all([seattleDriver.save(), miamiDriver.save()])
      .then(() => {
        request(app)
          .get('/api/drivers?lng=-80&lat=25')
          .end((err, response) => {
            assert(response.body.length === 1); // only find one record
            assert(response.body[0].email === 'miami@example.com');
            done();
          });
      })
      .catch(e => console.log(e));
  });

});
