import React, { Component } from 'react';
import {LineChart, Line, AreaChart, Area, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';


const data = [
      {name: 'Page A', uv: 4000, pv: 9000},
      {name: 'Page B', uv: 3000, pv: 7222},
      {name: 'Page C', uv: 2000, pv: 6222},
      {name: 'Page D', uv: 1223, pv: 5400},
      {name: 'Page E', uv: 1890, pv: 3200},
      {name: 'Page F', uv: 2390, pv: 2500},
      {name: 'Page G', uv: 3490, pv: 1209},
];


export default class FrequencyChart extends React.Component {
	render () {
  	return (
			<ResponsiveContainer width={700} height="80%">
				<AreaChart data={data}
					margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
					<XAxis dataKey="name" />
					<YAxis />
					<CartesianGrid strokeDasharray="3 3" />
					<Tooltip />
					<ReferenceLine x="Page C" stroke="green" label="Min PAGE" />
					<ReferenceLine y={4000} label="Max" stroke="red" strokeDasharray="3 3" />
					<Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
				</AreaChart>
			</ResponsiveContainer>
    );
  }
}
