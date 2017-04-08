
import request from '../utils/request';
import fetch from 'dva/fetch';
import { parseString } from 'xml2js';
import Zillow from '../utils/get_zillow';

export default {
  namespace: 'smartselect',
  state: {
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

    buildingHeight(state, datum){
      return { ...state, height: datum.height};
    },
    calculate(state, datum){
      return { ...state, calData: datum.calData};

    },

    mapLoaded(state, datum){
      return { ...state, mapLoaded: true, initialMap: datum.initialMap};
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
