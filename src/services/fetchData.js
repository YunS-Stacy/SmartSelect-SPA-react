import request from '../utils/request';
import {google, mapbox} from './config.json'
export function slider() {
  return request(`https://yunshi-stacy.carto.com/api/v2/sql?format=JSON&q=SELECT cartodb_id as id,zpid,opaid,refprice FROM finalparcel`);
}

export function geocode(address) {
  return request(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${google}`);
}
// https://api.mapbox.com/directions/v5/mapbox/driving/-73.989%2C40.733%3B-74%2C40.733.json?access_token=pk.eyJ1IjoieXVuc2hpIiwiYSI6ImNpeHczcjA3ZDAwMTMyd3Btb3Fzd3hpODIifQ.SWiqUD9o_DkHZuJBPIEHPA&geometries=geojson
export function direction(origin, dest) {
  console.log(`https://api.mapbox.com/directions/v5/mapbox/driving/${origin};${dest}?geometries=geojson&access_token=${mapbox}`)
  return request(`https://api.mapbox.com/directions/v5/mapbox/driving/${origin};${dest}?geometries=geojson&access_token=${mapbox}`);
}
