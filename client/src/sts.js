const axios = require('axios');
require('dotenv').config()
const STS_PORT = process.env.STS_PORT || 3001;
const hostSTS = process.env.HOST_STS || 'localhost';

async function getToken() {
  const { token, error } = await axios.get(`http://${hostSTS}:${STS_PORT}/token`)
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      return { error: error }
    })
    .then(function (response) {
      // handle success
      if (response?.data?.token) {
        return { token: response.data.token };
      } else {
        return { error: "No token received" };
      }

    });
  return { token, error };

}

module.exports = {
  getToken,
}