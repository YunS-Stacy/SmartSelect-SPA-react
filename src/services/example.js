import request from '../utils/request';

export function fetch( ) {
  return request(`https://gist.githubusercontent.com/yunshi-stacy/dedcd037381f619bbca233a1c83c4d61/raw/47955aa0165504a63286857a5f23cc5b65732ba9/philadelphia_crime_points.geojson`);
}
