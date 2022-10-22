const { nextISSTimesForMyLocation } = require('./iss_promised');
const { printPassTimes } = require('./iss');

nextISSTimesForMyLocation()
  .then((passes) => {
    printPassTimes(passes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });
