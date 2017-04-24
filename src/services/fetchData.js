import request from '../utils/request';
import {google, mapbox} from './config.json'
export function slider() {
  // return request(`https://yunshi-stacy.carto.com/api/v2/sql?format=JSON&q=SELECT cartodb_id as id,zpid,opaid,refprice FROM finalparcel`);
  return request(`https://smartselect-34c02.firebaseio.com/slider.json`);
}

export function market() {
  return request(`https://smartselect-34c02.firebaseio.com/localMarket.json`);
}
export function corrplot() {
  return request(`https://smartselect-34c02.firebaseio.com/corrPlot.json`);
}

export function geocode(address) {
  return request(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${google}`);
}

export function direction(origin, dest, methods) {
  return request(`https://api.mapbox.com/directions/v5/mapbox/${methods}/${origin};${dest}?geometries=geojson&access_token=${mapbox}`);
}

export function modelPerformance() {
  return request(`https://smartselect-34c02.firebaseio.com/modelPerformance.json`);
}

export function listing() {
  return request(`https://smartselect-34c02.firebaseio.com/houseListing.json`);
}
