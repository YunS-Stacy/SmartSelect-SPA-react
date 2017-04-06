import React, { Component } from 'react';
import g2 from 'g2';
import createG2 from 'g2-react';
import axios from 'axios';
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
	// rgb(127, 205, 187)
	// rgb(29, 145, 192)
	// rgb(219, 58, 27)
	// rgb(232, 92, 65)
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
	state = {
		data: [],
		forceFit: true,
		width: 550,
		height: 650,
		plotCfg: {
			margin: [50,150,100,50]
		}
	}


	componentWillMount() {
		const self = this;
		axios.get('https://gist.githubusercontent.com/YunS-Stacy/87e80a6a4e96725fe09546d15fb5029b/raw/5a422fb60be38fc5da2d8a6524605c48138e7b8c/data_corrplot.json')
		.then(function (response) {
			self.setState({
				data: response.data
			});
		}).catch(function (error) {
			console.log(error);
		});
	}

	render() {
		if (this.state.data.length === 0) {
			return (<div></div>);
		} else {
			return (
				<div style={{display: 'inline-flex'}}>
					<div style={{width: '50vw'}}>
						<Chart
							data={this.state.data}
							height={this.state.height}
							width={this.state.width}
							plotCfg={this.state.plotCfg}
							forceFit={this.state.forceFit} />
					</div>
					<div style={{width: '50vw', marginTop: '15vh'}}>
						<p style={{fontSize: '1.4em'}}>Corrplot</p>
					</div>

				</div>

				);
			}
		}
	};
