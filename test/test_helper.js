const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017';
const dbName = 'muber_test';

// tell mongoose which promise libariry to use
mongoose.Promise = global.Promise;

before(done => {
  mongoose.connect(`${url}/${dbName}`)
    .then(() => {
      // console.log('Good to go!');
      done();
    })
    .catch(e => console.warn('Error: ', e));
});

beforeEach(done => {
  const { drivers } = mongoose.connection.collections;
  //
  // in MongoDB, we cannot drop multiple collections at the same time
  // we have to drop the them one by one
  //
  drivers.drop()
    // dropping the collection will drop the index;
    // we have to recreate the index before we run the test that requires index
    .then(() => drivers.ensureIndex({ 'geometry.coordinates': '2dsphere' }))
    .then(() => done())
    .catch(() => done());
});
