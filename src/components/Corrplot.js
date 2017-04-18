import React, { Component } from 'react';
import g2 from 'g2';
import createG2 from 'g2-react';

import {Spin,Col,Row} from 'antd';

// x-Axis
const Chart = createG2(chart => {
	chart.cols({
		'Variable1': {
			type: 'cat',
			alias: 'Variables-xAxis'
		},
		'Variable2': {
			type: 'cat',
			alias: 'Variables-yAxis'
		},
		'COEF': {
			type: 'linear',
			alias: 'Coefficient',
			min: -1,
			max: 1,
			formatter: function(datum){
				return datum.toFixed(2)
			}
		}
	});

	chart.axis('Variable1', {
		labels: {
			label: null
		},
		grid: {
			line: {
				stroke: '#d9d9d9',
				lineWidth: 1,
				lineDash: [2, 2]
			}
		},
		tickLine: null,
		titleOffset: 10,
	});

	chart.axis('Variable2', {
		labels: {
			label: null
		},
		tickLine: null,
		titleOffset: 10,
	});
	chart.tooltip({
		title: null,
		offset: 0,
	})
	chart.legend('COEF',{
		position: 'right',
		height: 100,
		width: 10,
	});
	chart.polygon().position('Variable1*Variable2').color('COEF', 'rgb(254, 190, 18)-#f7f7f7-rgb(29, 145, 192)')
	.size('COEF',0,0.5)
	.style({
		cursor: 'pointer',
		lineWidth: 1,
		stroke: '#fff'

	}).tooltip('Variable1*Variable2*COEF');
	chart.render();
});

export default class Corrplot extends Component {
	render() {
			return (
				<Row>
					<Col span={12} offset={2}>
						<Spin
							spinning={this.props.data.length === 0}
							size='large'
							// style={{top: '20vw', position: 'absolute'}}
							delay={500}
						>
							{(this.props.data.length === 0) && (<div></div>)}
							{(this.props.data.length !== 0) && (<Chart {...this.props} />)}
						</Spin>
					</Col>
					<Col span={8}>
						<h3>Correlation Matrix</h3>
						<br />
						<p >Built a large dataset, it's time to find the least variables that describe the apartment price best.</p>
						<br/>
						<p >To find the relationship between variables, the correlation matrix may serve the goal well.</p>
					</Col>
				</Row>
			);
		}
	}
