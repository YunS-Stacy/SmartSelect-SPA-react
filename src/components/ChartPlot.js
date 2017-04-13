import React, { Component } from 'react';
import g2, { Frame } from 'g2';
import createG2 from 'g2-react';

const data = [
	{
		"Methods": "OLS Regression",
		"R Squared": 0.65,
		"MSE": 0.2,
		"RMSE": 0.45
	},
	{
		"Methods": "Gradient Boost",
		"R Squared": 0.77,
		"MSE": 0.13,
		"RMSE": 0.36
	},
	{
		"Methods": "Random Forests",
		"R Squared": 0.79,
		"MSE": 0.12,
		"RMSE": 0.35
	}
];

const Chart = createG2(chart => {
	chart.cols({
		'Index': { min: 0},
		'Methods': {alias: 'Model Type'}
	});

	chart.intervalDodge().position('Methods*Index').color('type', 'rgb(254, 190, 18)-rgb(29, 145, 192)');
	chart.render();
});

export default class ChartPlot extends Component {
	state = {
		data: [],
		forceFit: false,
		width: 500,
		height: 300,
		plotCfg: {
			margin: [50,100,50,70]
		}
	}

	componentWillMount(){
		let frame = new Frame(data);
		frame = Frame.combinColumns(frame, ['MSE','RMSE','R Squared'],'Index','type','Methods');
		frame = frame.toJSON();
		this.setState({
			data: frame
		})
	};

	render() {
		return (
				<Chart
					data={this.state.data}
					width={this.state.width}
					height={this.state.height}
					plotCfg={this.state.plotCfg}
					forceFit={this.state.forceFit} />
		);
	}
};
