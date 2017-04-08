
import request from '../utils/request';
import fetch from 'dva/fetch';
import { parseString } from 'xml2js';
import Zillow from '../utils/get_zillow';
import _ from 'lodash';
import turf from 'turf';

export default {
  namespace: 'smartselect',
  state: {
    draw:{},
    blueprint: {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [[[0,0],[0,0],[0,0],[0,0]]]
      },
    },
    // Three mode: 'mode-welcome', 'mode-query', 'mode-build'
    mode: 'mode-welcome',
    initialMap: {},
    mapLoaded: false,
    mapCenter: [-75.1639, 39.9522],
    mapPitch: 65,
    mapZoom: [14],
    mapBearing: 9.2,
    mapStyle:'mapbox://styles/yunshi/cizrdgy3c00162rlr64v8jzgy',
    mapInteractive: false,
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
    dataZillow: [],
  },

  reducers: {
    changeStyle(state, datum){
      const newStyle = datum.mapStyle;
      return { ...state, mapStyle: newStyle};
    },


    askCalculate(state){
      let data = state.draw.getAll();
      let calculatedValue = {
        polygon: {
          area: 0,
          length: 0
        },
        line: {
          length: 0
        },
        point: false,
        num: 0
      };

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
          calculatedValue.polygon.area = rounded_poly_area;
          calculatedValue.polygon.length = rounded_poly_length;
          break;

          case 'LineString':
          // convert square meters to square foot
          let line_length = turf.lineDistance(datum, 'miles');
          // restrict to 2 decimal points
          let rounded_line_length = Math.round(line_length*5280*100)/100;
          calculatedValue.line.length = rounded_line_length;
          break;
          case 'Point':
          calculatedValue.point = true;
          default:
        }
      });

      calculatedValue.num = data.features.length;
      return { ...state, calData: calculatedValue};
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
    mapLoaded(state, datum){

      return { ...state, mapLoaded: true, initialMap: datum.initialMap,draw:datum.draw};
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

    changeCenter(state, datum){
      return { ...state, mapCenter: datum.mapCenter}
    },

    changeMode(state, datum){
      const newMode = datum.mode;
      let newStyle, newPitch, newZoom, newCenter, newBearing, newFootVis, newParcelVis, newBlueVis;
      switch (newMode) {
        case 'mode-query':
        newStyle = 'mapbox://styles/yunshi/cizrdgy3c00162rlr64v8jzgy';
        newPitch = 0;
        newZoom =[16];
        newCenter = [-75.1639, 39.9522];
        newBearing = 0;
        newFootVis = 'none';
        newParcelVis = 'visible';
        newBlueVis = 'visible';
        break;
        case 'mode-welcome':
        newStyle = 'mapbox://styles/yunshi/cizrdgy3c00162rlr64v8jzgy';
        newPitch = 65;
        newZoom =[14];
        newCenter = [-75.1639, 39.9522];
        newBearing = 9.2;
        newFootVis = 'visible';
        newParcelVis = 'none';
        newBlueVis = 'none';

        break;
        default:
        break;
      }
      // zoom number must extract the number first, cannot tell [14] === [14] is true
      return { ...state, mode: newMode, mapStyle: newStyle, mapPitch: newPitch,
        mapZoom: [newZoom], mapCenter: newCenter, mapBearing: newBearing,
        footVis: newFootVis, parcelVis: newParcelVis, blueVis: newBlueVis};
      },

      getZillow(state, datum){
        const newDataZillow = datum.dataZillow;
        return { ...state, dataZillow: newDataZillow }
      }
    },

    effects: {

      *queryZillow( datum, { call, put }){
        const zpid = datum.zpid;
        const dataZillow = yield call(Zillow.getComps, zpid);
        yield put({ type: 'getZillow', dataZillow})
      }
    },
    subscriptions: {
      setup({ dispatch }) {
        console.log('store is connected and listening');
      },
    },
  };
