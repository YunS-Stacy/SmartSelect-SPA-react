
import request from '../utils/request';
import fetch from 'dva/fetch';
import { parseString } from 'xml2js';
import Zillow from '../utils/get_zillow';

//
// var zillow = function(address){
//   //go through the CORS problem
//   $.ajaxPrefilter( function (options) {
//     if (options.crossDomain && jQuery.support.cors) {
//       var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
//       options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
//       //options.url = "http://cors.corsproxy.io/url=" + options.url;
//     }
//   });
//   var xml;
//   //function to parse xml as DOM
//   jQuery.extend({
//     getValues: function(url) {
//       var result = null;
//       $.ajax({
//         url: url,
//         type: 'get',
//         dataType: 'xml',
//         async: false,
//         success: function(data) {
//           result = data;
//         }
//       });
//       return result;
//     }
//   });
//   //check availability, else return ''
//   var getData = function(tagName){
//     if (tagName === 'zpid' || tagName=== 'useCode' || tagName=== 'taxAssessmentYear' || tagName=== 'taxAssessment' || tagName=== 'lastSoldDate' || tagName=== 'lastSoldPrice' || tagName=== 'yearBuilt' || tagName=== 'lotSizeSqFt' || tagName=== 'finishedSqFt')
//     {if (typeof $(results).find(tagName)[0] === 'object'){
//       console.log(tagName+': '+$(results).find(tagName)[0].innerHTML);
//       return $(results).find(tagName)[0].innerHTML;
//     } else {
//       console.log(tagName +': Unknown');
//       return 'Unknown';}
//     }
//     if (tagName === 'amount' || tagName=== 'last-updated' || tagName=== 'low' || tagName=== 'high')
//     {if (typeof $(results).find(tagName)[1] === 'object'){
//       console.log(tagName+': '+$(results).find(tagName)[1].innerHTML);
//       return $(results).find(tagName)[1].innerHTML;
//     } else {
//       console.log(tagName +': Unknown');
//       return 'Unknown';
//     }}
//   };
//   //get input
//   var zwsId = 'X1-ZWz19eddsdp2bv_1r7kw';
//   var results = jQuery.getValues('http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id='+ zwsId +'&address='+ address +'&citystatezip=Philadelphia%2C+PA&rentzestimate=true');
//   var zpid = getData('zpid');
//   //get type
//   var useCode = getData('useCode');
//   //tax/sale records
//   var taxAssessmentYear = getData('taxAssessmentYear');
//   //console.log('taxYear'+taxAssessmentYear)
//   var taxAssessment = getData('taxAssessment');
//   var lastSoldDate = getData('lastSoldDate');
//   var lastSoldPrice = getData('lastSoldPrice');
//   //details
//   var yearBuilt = getData('yearBuilt');
//   var lotSizeSqFt = getData('lotSizeSqFt');
//   var finishedSqFt = getData('finishedSqFt');
//   var neighborhood = $(results).find('region').attr("name");
//   //calculate rent perSqft
//   var rentAmount = getData('amount');
//   //console.log(rentAmount);
//   var lastUpdated = getData('last-updated');
//   var valueChangeLow = getData('low');
//   var valueChangeHigh = getData('high');
// };

export default {
  namespace: 'smartselect',

  state: {
    mode: 'mode-welcome',
    initialMap: {},
    mapLoaded: false,
    mapCenter: [-75.1639, 39.9522],
    mapPitch: 0,
    mapZoom: [14],
    mapBearing: 9.2,
    mapStyle:'mapbox://styles/yunshi/cizrdgy3c00162rlr64v8jzgy',

    calData: {
      polygon: {
        area: 0,
        length: 0
      },
      line: {
        length: 0
      },
      num: 0,
      point: false,
    },
    height: 0
  },

  reducers: {

    styleChange(state, datum){
      const newStyle = datum.mapStyle;
      return { ...state, mapStyle: newStyle};
    },

    buildingHeight(state, datum){
      return { ...state, height: datum.height};
    },
    calculate(state, datum){
      return { ...state, calData: datum.calData};

    },
    // initialMap(state, datum){
    //   console.log('store has the initialMap')
    //   console.log(datum.initialMap);
    //
    //   return { ...state, initialMap: datum.initialMap}
    //
    // },
    // showMapping(state){
    //   console.log('show mapping dispatch');
    //   return { ...}
    //
    // },
    mapLoaded(state, datum){
      return { ...state, mapLoaded: true, initialMap: datum.initialMap};
    },

    changeCenter(state, datum){
      return { ...state, mapCenter: datum.mapCenter}
    },

    changeMode(state){

      const newMode = state.mode === 'mode-welcome' ? 'mode-mapping' : 'mode-welcome'
      const newPitch = state.mapPitch === 0 ? 60 : 0
      const newZoom = state.mapZoom[0] === 14 ? 15 :14// extract the number first, cannot tell [14] === [14] is true
      const newCenter = [-75.1639, 39.9522]
      const newBearing = state.mapBearing === 9.2 ? 0 : 9.2

      return { ...state, mode: newMode, mapPitch: newPitch, mapZoom: [newZoom], mapCenter: newCenter, mapBearing: newBearing};
    }
  },
  //https://gist.githubusercontent.com/yunshi-stacy/dedcd037381f619bbca233a1c83c4d61/raw/47955aa0165504a63286857a5f23cc5b65732ba9/philadelphia_crime_points.geojson
  effects: {
    *addchartData(){
//       fetch(url).then(function (response) {
//   if (!response.ok) {
//     throw new TypeError('bad response status');
//   }
//   return cache.put(url, response);
// })

      const data = Zillow.getZestimateFromProperty('2930 Chestnut Street')
      console.log(data)

    }
  },
  subscriptions: {
  setup({ dispatch }) {
    console.log('store is connected and listening');
    dispatch({ type: 'addchartData' });
    console.log('dispatched')
  },
},
  // subscriptions: {},
};

// var smartselect = {
//     app: {},
//     map: {},
//     graph: {},
// };
