
import request from '../utils/request';
import fetch from 'dva/fetch';
import { parseString } from 'xml2js';
import Zillow from '../utils/get_zillow';
import _ from 'lodash';
import turf from 'turf';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from 'mapbox-gl-draw';

export default {
  namespace: 'smartselect',
  state: {
    scaleControl: new mapboxgl.ScaleControl({unit: 'imperial'}),
    geolocateControl: new mapboxgl.GeolocateControl(),
    naviControl: new mapboxgl.NavigationControl(),
    draw: new MapboxDraw({
      displayControlsDefault: true,
      controls: {
        polygon: true,
        trash: true
      },
    }),
    // draw:{},
    blueprint: {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [[[0,0],[0,0],[0,0],[0,0]]]
      },
    },
    // Three mode: 'mode-welcome', 'mode-query', 'mode-build'
    mode: 'mode-welcome',
    map: {},
    mapLoaded: false,
    mapCenter: [-75.1639, 39.9522],
    mapPitch: [65],
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

      return { ...state, mapLoaded: true, map: datum.map,draw:datum.draw};
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
      const map = state.map;
      const mode = datum.mode;
      let {mapStyle, mapPitch, mapZoom, mapCenter, mapBearing, footVis, parcelVis, blueVis} = state
      switch (mode) {
        case 'mode-welcome':
        mapPitch = [65];
        mapZoom =[14];
        mapCenter = [-75.1639, 39.9522];
        mapBearing = 9.2;
        footVis = 'visible';
        parcelVis = 'none';
        blueVis = 'none';
        map.removeControl(state.scaleControl);
        map.removeControl(state.geolocateControl);
        map.removeControl(state.naviControl);
        map.removeControl(state.draw);
        break;

        case 'mode-query':
        mapPitch = [0];
        mapZoom =[16];
        mapBearing = 0;
        footVis = 'none';
        parcelVis = 'visible';
        map.addControl(state.scaleControl,'bottom-right');
        map.addControl(state.geolocateControl,'bottom-right');
        map.addControl(state.naviControl,'bottom-right');
        map.addControl(state.draw,'bottom-right');
        break;

        case 'mode-build':
        console.log('entering mode-build')
        mapPitch = [65];
        mapZoom =[14];
        mapBearing = 9.2;
        parcelVis = 'none';
        blueVis = 'visible';
        break;
        default:
        break;
      }

      // zoom number must extract the number first, cannot tell [14] === [14] is true
      return { ...state, mode, mapStyle, mapPitch,
        mapZoom, mapCenter, mapBearing,
        footVis, parcelVis, blueVis};
      },

      getZillow(state, datum){

        return { ...state, dataZillow: datum.dataZillow }
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
