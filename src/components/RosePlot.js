import React, { Component } from 'react';
import g2 from 'g2';
import createG2 from 'g2-react';

const Chart = createG2(chart => {
	chart.coord('polar',{radius: 0.7});
	chart.axis('valueChange', {
		labels: null,
		tickLine: null,
		line: null,
		grid: null
	});
	chart.axis('Region_Name', {
		labels: {
			label: {
				fontSize: '8px',
				textAlign: 'end',
			},
		},
	});
	chart.legend(false);
	chart.tooltip(true, {
		offset: -150,
	})

	chart.interval().position('Region_Name*valueChange')
	.color('monthYear', 'rgb(12, 44, 132)-rgb(34, 94, 168)-rgb(29, 145, 192)-rgb(65, 182, 196)-rgb(127, 205, 187)')
	.opacity(0.2)
	.style({
		lineWidth: 0.03,
		stroke: '#fff',
	});
	chart.render();
});

export default class RosePlot extends Component {
	render() {
		if (this.props.data.length === 0) {
			return (<div></div>);
		} else {
			return (
					<Chart
						data={this.props.data}
						forceFit={true}
						width={600}
						height={600}
						plotCfg={{
								margin: [50,50,50,50]
						}}
					/>
				);
			}
		}
	};
