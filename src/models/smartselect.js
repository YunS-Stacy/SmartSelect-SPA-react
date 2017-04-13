
import request from '../utils/request';
import fetch from 'dva/fetch';
import { parseString } from 'xml2js';


import Zillow from '../services/fetchZillow';
import * as fetchData from '../services/fetchData';


import _ from 'lodash';
import turf from 'turf';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from 'mapbox-gl-draw';
import MapboxGeocoder from 'mapbox-gl-geocoder';


import g2, {Stat, Frame} from 'g2';

import { mapbox } from '../services/config';

export default {
  namespace: 'smartselect',
  state: {
    scaleControl: new mapboxgl.ScaleControl({unit: 'imperial'}),
    geolocateControl: new mapboxgl.GeolocateControl(),
    naviControl: new mapboxgl.NavigationControl(),
    // directionControl: new MapboxDirections({
    //   accessToken: 'pk.eyJ1IjoieXVuc2hpIiwiYSI6ImNpeHczcjA3ZDAwMTMyd3Btb3Fzd3hpODIifQ.SWiqUD9o_DkHZuJBPIEHPA',
    //   unit: 'metric',
    // }),
    draw: new MapboxDraw({
      displayControlsDefault: true,
      controls: {
        polygon: true,
        trash: true
      },
    }),
    geocoderControl: new MapboxGeocoder({
    accessToken:  'pk.eyJ1IjoieXVuc2hpIiwiYSI6ImNpeHczcjA3ZDAwMTMyd3Btb3Fzd3hpODIifQ.SWiqUD9o_DkHZuJBPIEHPA'
}),
    // draw:{},
    blueprint: {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [[[0,0],[0,0],[0,0],[0,0]]]
          }
        }
      ]
    },
    // Three mode: 'mode-welcome', 'mode-query', 'mode-build'
    mode: 'mode-welcome',
    map: {},
    // maxBounds: mapboxgl.LngLatBounds.convert(arr);SW39.824024,-75.3324037,40.1551322,-74.9240231
    maxBounds: [[-75.3324037,39.824024],[-74.9240231,40.1551322]],
    mapLoaded: false,
    mapCenter: [-75.1639, 39.9522],
    mapPitch: [65],
    mapZoom: [14],
    mapBearing: 9.2,
    mapStyle:'mapbox://styles/yunshi/cizrdgy3c00162rlr64v8jzgy',
    styleName: 'customized',
    footVis: 'visible',
    blueVis: 'none',
    parcelVis: 'none',
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
    height: 0,
    compsLines:[],
    compsPts:[],
    routeLines:[[],[]],
    routePts:[],
    dataSlider: [],
    dataInitialized: false,
    parcelRange: [0,600000],
    snackMessage: '',
    compsInfo: false,
    popupInfo: {
      coords:[0,0],
      address: '',
      refPrice: 0,
      source: '',
      zoning: '',
      opa: '',
      zpid: '',
    },
    tableStatus: 'hidden',
    tableMessage: {
      address: '',
      lastSoldDate: '',
      lastSoldPrice: '',
      zestimate: '',
      monthChange: '',
      valueHigh: '',
      valueLow: '',
    },
  },
  reducers: {
    showSnack(state, datum){
      return {...state, snackMessage: datum.snackMessage}
    },
    clearPopup(state){
      return { ...state,   popupInfo: {
        coords:[0,0],
        address: '',
        refPrice: 0,
        source: '',
        zoning: '',
        opa: '',
        zpid: '',
      },
    }
  },
  showPopup(state, datum){
    let {popupInfo} = state;
    const feature = datum.feature;
    let address = feature.properties['location'];
    address = _.toLower(feature.properties['location']);
    address = _.startCase(address); // handle the upper and lowercase
    popupInfo = {
      coords: [feature.properties['lon'],feature.properties['lat']],
      address: address,
      refPrice: feature.properties['refprice'].toFixed(2),
      source: feature.properties['predicted'] === 1 ? 'Predicted Value' : 'Record from Latest Transaction',
      zoning: feature.properties['zoning'],
      opa: feature.properties['opa_accoun'],
      zpid: feature.properties['zpid'],
    }
    return { ...state, popupInfo }
  },
  showTable(state, datum){
    let {tableStatus, tableMessage} = state;
    tableMessage = datum.feature;
    tableStatus = datum.tableStatus;
    return { ...state, tableStatus, tableMessage }
  },
  changeStyle(state, datum){
    let {mapStyle, styleName} = state;
    styleName = datum.styleName;
    switch (styleName) {
      case 'customized':
      mapStyle = 'mapbox://styles/yunshi/cizrdgy3c00162rlr64v8jzgy';
      break;
      case 'satellite':
      mapStyle = 'mapbox://styles/yunshi/cj0u96uwe009w2rqryu8r7bg8';
      break;
      case 'light':
      mapStyle = 'mapbox://styles/yunshi/cj0u990c700fm2smr7yvnv1c5';
      break;
      default:
      break;
    };
    return { ...state, mapStyle, styleName};
  },
  askCalculate(state){
    const data = state.draw.getAll();
    const num = data.features.length;
    let {calData, snackMessage} = state;
    calData.num = num;
    snackMessage = `You have drawn ${num} things. We will calculate only the last of each type of shapes.`
    _.each(data.features,(datum)=>{
      let type = datum.geometry.type;
      switch (type) {
        case 'Polygon':
        // convert square meters to square foot
        let poly_area = turf.area(datum) * 10.7639;
        let poly_length = turf.lineDistance(datum, 'miles');
        // restrict to 2 decimal points
        let rounded_poly_area = Math.round(poly_area*100)/100;
        let rounded_poly_length = Math.round(poly_length*5280*100)/100;
        calData.polygon.area = rounded_poly_area;
        calData.polygon.length = rounded_poly_length;
        break;
        case 'LineString':
        // convert square meters to square foot
        let line_length = turf.lineDistance(datum, 'miles');
        // restrict to 2 decimal points
        let rounded_line_length = Math.round(line_length*5280*100)/100;
        calData.line.length = rounded_line_length;
        break;
        case 'Point':
        calData.point = true;
        snackMessage = 'Sorry, we can not measure a point!';
        break;
        default:
        break;
      }
    });
    return { ...state, calData, snackMessage};
  },

  buildingHeight(state, datum){
    return { ...state, height: datum.height};
  },
  askExtrude(state, datum){
    const height = datum.height;
    let data = state.draw.getAll();
    // only draw the polygon
    data.features = _.filter(data.features, function(datum){
      return datum.geometry.type === 'Polygon' || datum.geometry.type === 'MultiPolygon';
    });
    if (data.features.length > 0){
      return { ...state, blueprint: data, height: height}
    } else {
      return { ...state, height: height}
    }
  },
  asyncLoaded(state, datum){
    return { ...state, mapLoaded: datum.mapLoaded };
  },
  mapSetup(state, datum){
    return { ...state, map: datum.datum.map,draw: datum.datum.draw};
  },

  changeVis(state, datum){
    const newVis = datum.layerVis;
    switch (datum.layerName) {
      case 'parcel':
      return { ...state, parcelVis: newVis};
      case 'footprint':
      return { ...state, footVis: newVis};
      case 'blueprint':
      return { ...state, blueVis: newVis};
      default:
      break;
    };
  },

  changePitch(state, datum){
    return { ...state, mapPitch: datum.mapPitch}
  },

  changeCenter(state, datum){
    return { ...state, mapCenter: datum.mapCenter}
  },

  changeMode(state, datum){
    const map = state.map;
    const mode = datum.mode;
    let {mapStyle, styleName, mapPitch, mapZoom, mapCenter, mapBearing,
      compsLines,compsPts, parcelRange,
      footVis, parcelVis, blueVis,
      popupCoords,tableStatus, height} = state
    switch (mode) {
      case 'mode-welcome':
      if(state.mode !== 'mode-welcome'){
        mapPitch = [65];
        mapZoom =[14];
        mapCenter = [-75.1639, 39.9522];
        mapBearing = 9.2;
        height= 0,

        footVis = 'visible';
        parcelVis = 'none';
        blueVis = 'none';
        map.removeControl(state.scaleControl);
        map.removeControl(state.geolocateControl);
        map.removeControl(state.naviControl);
        map.removeControl(state.draw);
        popupCoords = [0,0];
        tableStatus = 'hidden';
      }
      break;

      case 'mode-intro':
      if(state.mode !== 'mode-intro'){
        footVis = 'none';
        parcelVis = 'none';
        mapPitch = [0];
        mapZoom =[16];
        mapBearing = 0;

        if(state.mode === 'mode-welcome'){
          map.addControl(state.scaleControl,'bottom-right');
          map.addControl(state.geolocateControl,'bottom-right');
          map.addControl(state.naviControl,'bottom-right');
          map.addControl(state.draw,'bottom-right');
        }
      }
      break;
      case 'mode-query':
      //make sure comes from the previous step
      if (state.mode !== 'mode-query'){
        footVis = 'none';
        parcelVis = 'visible';
        blueVis = 'none';
        mapPitch = [0];
        mapBearing = 0;
      };
      break;
      case 'mode-measure':
      if(state.mode !== 'mode-measure'){
        popupCoords = [0,0];
        tableStatus = 'hidden';
        compsLines=[];
        compsPts=[];
        parcelRange=[0,600000];
        blueVis = 'none';
        footVis = 'none';
        parcelVis = 'visible';
        mapPitch = [0];
        mapBearing = 0;
        height = 0;
      }
      break;
      case 'mode-build':
      if (state.mode !== 'mode-build'){
        console.log('test mode build')
        mapPitch = [65];
        mapBearing = 9.2;
        parcelVis = 'none';
        blueVis = 'visible';
        footVis = 'none';
      };
      break;
      default:
      break;
    }
    // zoom number must extract the number first, cannot tell [14] === [14] is true
    return { ...state, mode, mapPitch,
      mapZoom, mapCenter, mapBearing,
      compsLines,compsPts, parcelRange,
      footVis, parcelVis, blueVis};
    },

    getZillow(state, datum){
      let {compsLines, compsPts, snackMessage, popupInfo, map} = state;
      // {dataZillow} = datum.dataZillow;
      const dataType = typeof datum.dataZillow;
      switch (dataType) {
        case 'object':
        // set the line data
        const linePairs = _.map(datum.dataZillow, (item)=>{
          let pairs = [ _.values(item.coord), _.values(popupInfo.coords)];
          return pairs;
        });
        compsLines = linePairs;

        const tempPts = datum.dataZillow.map((item, i)=>{
          return turf.point(_.values(item.coord),{...item, i});
        })
        // set the point data
        compsPts = tempPts
        // add the origin to create bbox contains all features
        const origin = turf.point(popupInfo.coords); //convert to array
        const tempBbox = turf.featureCollection(_.concat(tempPts, [origin]))
        const bounds = turf.bbox(tempBbox);
        map.fitBounds(bounds, {padding: 100});
        break;
        case 'string':
        snackMessage = datum.dataZillow;
        break;
        default:
        break;
      }
      return { ...state, compsLines, compsPts, snackMessage}
    },
    getRoute(state, datum){
      let {routeLines, snackMessage, routePts, popupInfo} = state;
console.log(datum.res)
      if(datum.res.code === 'Ok'){
        routeLines = datum.res.routes[0].geometry.coordinates;
        routeLines = [routePts, ...routeLines, popupInfo.coords]
      } else{
        snackMessage = `Sorry, we don't find any route!`
      }
      console.log(routeLines)
      return { ...state, routeLines, snackMessage}
    },

    getSlider(state, datum){
      const response = datum.res.data.rows
      const frame = new Frame(response);
      const filterData = Frame.filter(frame, function(obj, index) {
        return obj.refprice < 600000;
      });
      const tempData = Frame.sort(filterData, 'refprice');
      const data = tempData.toJSON();
      return { ...state, dataSlider: data, dataInitialized: true }
    },

    getAddress(state, datum){
      let {mapCenter, snackMessage,routePts} = state;
      if(datum.res.status === 'OK'){
        const coords = datum.res.results[0].geometry.location;
        mapCenter = coords;
        routePts = [coords['lng'], coords['lat']];
        console.log(routePts)
      } else {
        snackMessage = `Sorry, we can't find the place!`
      }
      return { ...state, mapCenter,snackMessage, routePts}
    },


    filterParcel(state, datum){
      const parcelRange = datum.parcelRange;
      return {...state, parcelRange}
    },


  },
  effects: {
    *mapLoad(datum, {call,put}){
      yield put({ type: 'mapSetup', datum});
      const res = yield call(fetchData.slider);
      yield put({ type: 'getSlider', res});
    },

    *queryZillow(datum, {call, put}){
      const {zpid} = datum;
      const dataZillow = yield call(Zillow.getComps, zpid);
      yield put({ type: 'getZillow', dataZillow});
    },

    *geocodeAddress(datum, {call, put}){
      const {address} = datum;
      const res = yield call(fetchData.geocode, address);
      yield put({ type: 'getAddress', res: res.data});
    },

    *geocodeRoute(datum, {call, put, select}){
      const {dest} = datum;
      const origin = yield select(state => state.smartselect.routePts);
      if(origin.length > 0){
        const res = yield call(fetchData.direction, origin, dest);
        yield put({ type: 'getRoute', res: res.data});
      } else {
        yield put({ type: 'showSnack', snackMessage: 'Please search for the address first!'})
      }
    },
  },
  subscriptions: {
    setup({ dispatch}) {
      console.log('store is connected and listening');
    },
  },
};
