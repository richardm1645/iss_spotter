const request = require('request');

const fetchMyIP = function(cb) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      cb(error, null); //error, ip

    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      cb(Error(msg), null);

    } else {
      const IP = JSON.parse(body).ip;
      cb(null, IP); //error, ip
    }
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request('http://ipwho.is/' + ip, (error, response, body) => {
    if (error) {
      callback(error, null); //error, result
    
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching details. Response: ${body}`;
      callback(Error(msg), null);
    
    } else {
      const location = {};
      location.latitude = JSON.parse(body).latitude;
      location.longitude = JSON.parse(body).longitude;
      callback(null, location);
    }
  });
};

const fetchISSFlyOverTimes = function(coords, cb) {
  const latitude = coords.latitude;
  const longitude = coords.longitude;
  request('https://iss-flyover.herokuapp.com/json/?lat=' + latitude + '&lon=' + longitude, (error, response, body) => {
    if (error) {
      cb(error, null); //error, result
    
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching details. Response: ${body}`;
      cb(Error(msg), null);

    } else {
      const flyOverTimes = JSON.parse(body).response;
      cb(null, flyOverTimes);
    }
  });
};


const nextISSTimesForMyLocation = function(cb) {
  fetchMyIP((error, ip) => {
    if (error) {
      cb(error, null);
    }
    fetchCoordsByIP(ip, (error, location) => {
      if (error) {
        cb(error, null);
      }
      fetchISSFlyOverTimes(location, (error, flyOverTimes) => {
        if (error) {
          cb(error, null);
        }
        cb(null, flyOverTimes);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };