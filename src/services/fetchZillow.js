'use strict';
import _ from 'lodash';
import {zillow} from './config.json'
const {parseString} = require('xml2js');
const Zillow = {};
/**
*
* @param zpid - The Zillow Property ID for the property for which to obtain information. (int)
* @param rent - Return Rent Zestimate information if available (boolean true/false, default: false)
* @returns {Promise}
*/
Zillow.getComps = function (zpid) {
  return new Promise(function (resolve, reject) {
    const params = `zws-id=${zillow}&zpid=${zpid}&count=3`;
    const endpoint = `http://cors-anywhere.herokuapp.com/www.zillow.com/webservice/GetDeepComps.htm?`;
    fetch(`${endpoint}${params}`)
    .then(res => res.text())
    .catch(err => reject(err))
    .then(res => {
      parseString(res, (err, result) => {
        if (err) return reject(err);
        if (result["Comps:comps"].message[0].code[0] != 0 ){
          resolve('Sorry, no comps are found!')
        } else {
          const results = _.map(result["Comps:comps"].response[0].properties[0].comparables[0].comp, function(datum){
            let tempObj = _.pick(datum, ['address', 'lastSoldDate','lastSoldPrice','zestimate'])
            let coord = _.pick(tempObj.address[0], ['longitude', 'latitude']);
            let lastSoldDate = tempObj.lastSoldDate[0];
            let lastSoldPrice = tempObj.lastSoldPrice[0]._;
            let zestimate = tempObj.zestimate[0].amount[0]._;
            let monthChange = tempObj.zestimate[0].valueChange[0]._;
            let valueHigh = tempObj.zestimate[0].valuationRange[0].high[0]._;
            let valueLow = tempObj.zestimate[0].valuationRange[0].low[0]._;
            let address = _.pick(tempObj.address[0], ['street']).street[0];
            return {
              address: address,
              coord: {lng: _.toNumber(coord.longitude[0]),lat: _.toNumber(coord.latitude[0])},
              lastSoldDate: lastSoldDate,
              lastSoldPrice: lastSoldPrice,
              zestimate: zestimate,
              monthChange: monthChange,
              valueHigh: valueHigh,
              valueLow: valueLow,
            }
          });
          resolve(results);
        }

      })
    })
    .catch(err => {
      reject(err);
    })

  });
};

module.exports = Zillow;
