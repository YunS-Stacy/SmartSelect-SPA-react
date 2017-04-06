import React, { Component } from 'react';
import g2, { Shape } from 'g2';
import createG2 from 'g2-react';

const Chart = createG2(chart => {
  chart.cols({
    valueChange: {
      type: 'linear',
      min: 94,
      max: 125,
      alias: 'Median House Price'
    }
  });
  chart.coord('helix', {
    startAngle:  Math.PI,
    endAngle: 15.334 * Math.PI,
  }).rotate(90);
  Shape.registShape('interval', 'max', {
    getShapePoints: function(cfg){
      var x = cfg.x;
      var y = cfg.y;
      var y0 = cfg.y0;
      var width = cfg.size;
      return [
        {x: x-width, y: y0},
        {x: x-width, y: 1},
        {x: x+width, y: 1},
        {x: x+width, y: y0}
      ]
    }
  });
  chart.tooltip({
    title:null,
    map:{
      name: 'monthYear',
      value: 'valueChange'
    }
  })

  chart.legend('valueChange',{
    position: 'right',
    width: 10,
    height: 200,
  })

  chart.axis('monthYear', {
    tickLine: null,
    line: null
  })

  chart.interval().position('monthYear*valueChange')
  .color('valueChange', '#ffffff-rgb(29,145,192)')
  .opacity(0.8)
  .shape('max').
  label('monthYear', (monthYear)=>{
    return monthYear.substring(0,3)
  },{
    label:{
      fontSize:'1',
      textBaseline: 'bottom'
    },
  })
  chart.render();

});

export default class RosePlotPhilly extends Component {
  state = {
    // data: [],
    forceFit: true,
    height: 600,
    width: 500,
    plotCfg: {
      margin: [100,150,100,50]
    }
  }
    render() {
      if (this.props.data.length === 0) {
        return (<div></div>);
      } else {
        return (
          <div>
            <Chart
              data={this.props.data}
              width={this.state.width}
              height={this.state.height}
              plotCfg={this.state.plotCfg}
              forceFit={this.state.forceFit}
            />
            <p style={{fontSize: '1.4em', marginTop: '-50px', position: 'absolute', marginRight: '50px'}}>It can be observed that in Philadelphia, the local housing market maintains a healthy state in recent years, which reflects a stable housing demand.</p>

          </div>
        );
      }
    }
  };
