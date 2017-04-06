'use strict';
const zwsId = 'X1-ZWz1fn3adc83rf_634pb'; // The Zillow Web Service Identifier.
const {parseString} = require('xml2js');
const Zillow = {};

/**
 *
 * @param address - The address of the property to search. This string should be URL encoded.
 * @param zip - The city+state combination and/or ZIP code for which to search. This string should be URL encoded.
 * Note that giving both city and state is required. Using just one will not work.
 *
 * @returns {Promise}
 */
Zillow.getProperty = function (address) {
  return new Promise(function (resolve, reject) {

    const params = `zws-id=${zwsId}&address=${encodeURIComponent(address)}&citystatezip=Philadelphia%20PA`;
    const endpoint = `http://cors-anywhere.herokuapp.com/www.zillow.com/webservice/GetDeepSearchResults.htm?`;

    fetch(`${endpoint}${params}`)
        .then(res => res.text())
        .catch(err => reject(err))
        .then(res => {
          // console.log(res); xml response from zillow
          parseString(res, (err, result) => {
            if (err) return reject(err);
            if (!result["SearchResults:searchresults"].response) return reject(new Error('No response from Zillow'));
            const results = result["SearchResults:searchresults"].response[0].results[0].result[0];
            resolve(results);
          })
        })
        .catch(err => {
          reject(err);
        })
  })
};


/**
 *
 * @param zpid - The Zillow Property ID for the property for which to obtain information. (int)
 * @param rent - Return Rent Zestimate information if available (boolean true/false, default: false)
 * @returns {Promise}
 */
Zillow.getZestimate = function (zpid) {
  console.log('zestimate')
  return new Promise(function (resolve, reject) {
    const zpid = 2094780990
    const params = `zws-id=${zwsId}&zpid=${zpid}&count=1`;
    const endpoint = `http://cors-anywhere.herokuapp.com/www.zillow.com/webservice/GetDeepComps.htm?`;

    fetch(`${endpoint}${params}`)
        .then(res => res.text())
        .catch(err => reject(err))
        .then(res => {
          parseString(res, (err, result) => {
            if (err) return reject(err);
            if (!result["Comps:comps"].response) return reject(new Error('No response from Zestimate'));
            const results = result["Comps:comps"].response[0].properties[0].comparables[0].comp[0].lastSoldPrice[0]._;
            console.log(results)
            resolve(results);
          })
        })
        .catch(err => {
          reject(err);
        })

  });
};

/**
 * Special async function to handle the whole process
 * @param address
 * @param zip
 * @returns {Promise.<void>}
 */
Zillow.getZestimateFromProperty = async function (address, zip) {
  try {
    // Grab propertyObj first, we'll need the zpid from here
    const propertyObj = await Zillow.getProperty(address, zip);
    const zpid = propertyObj.zpid[0];
    console.log(zpid);
    const zestimate = parseInt(propertyObj.zestimate[0].amount[0]._);
    // console.log(zestimate)
    console.log(isNaN(propertyObj.lastSoldPrice) )
    const last_sold_value = isNaN(propertyObj.lastSoldPrice)=== false ? parseInt(propertyObj.lastSoldPrice[0]._) : '';
    // const last_sold_date = propertyObj.lastSoldDate[0];
    const zestimateObj = await Zillow.getZestimate(zpid);
    // console.log(zestimateObj)
    // const zillow_value = parseInt(zestimateObj.zestimate[0].amount[0]._);
    console.log(zpid)
    return {
      // last_sold_date,
      // last_sold_value,
      zestimate,
      zpid,
    }
  } catch (e) {
    console.log('Error fetching Zillow', e);
  }
};


module.exports = Zillow;
