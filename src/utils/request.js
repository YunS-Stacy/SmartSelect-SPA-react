import fetch from 'dva/fetch';

import {parseString} from 'xml2js';

// boilerplate
function parseJSON(response) {

  return response.toJSON()
  // .json();
}

function parseXML(response) {
  return parseString(response)
  // .json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(console.log('hey'))
    .then(function(response){console.log(response)})
    .then(response => response.text())
    .then(parseXML)
    // .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}
