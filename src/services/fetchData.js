import request from '../utils/request';

export function slider() {
  return request(`https://yunshi-stacy.carto.com/api/v2/sql?format=JSON&q=SELECT cartodb_id as id,zpid,opaid,refprice FROM finalparcel`);
}
