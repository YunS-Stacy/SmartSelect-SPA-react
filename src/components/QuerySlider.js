import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Spin, Slider} from 'antd';

import g2, {Stat, Frame} from 'g2';
import createG2 from 'g2-react';

const paperStyle = {
  position: 'absolute',
  bottom: '3vh',
  left: '0',
  width: '50vw',
  height: '19vh',
  // right: '17em',
  "backgroundColor": 'rgba(255,255,255,0.8)',
  zIndex: 9
}

const sliderStyle = {
  position: 'absolute',
  width: '90vw',
  bottom: '5em',
  border: '0',
  height: '2px',
}

class HigherChart extends Component {
  constructor(props) {
    super(props);
    this.Chart = createG2(chart => {
      this.chart = chart;
      chart.col('refprice', {
        alias: 'Reference Price',
        nice: true,
        formatter: (val)=>{
          return '$' + val.toFixed(0);
        }
      });
      chart.axis('..count', {
        tickLine: null,
        titleOffset: 48,
      });
      chart.axis('refprice', {
        titleOffset: 35,
      });
      chart.cols({
        '..count': {
          tickCount : 3
        },
      });


      chart.tooltip({
        title: null,
        map: {
          name: 'Price',
          value: 'refprice',
        },

        crosshairs: true
      });
      chart.setMode('select');
      chart.select('rangeX');
      chart.line().position(Stat.summary.count(Stat.bin.dot('refprice',0.01))).shape('smooth').color('#1D91C0');
      chart.area().position(Stat.summary.count(Stat.bin.dot('refprice',0.01))).shape('smooth').color('#1D91C0');
      chart.render();
    });
  }

  componentDidMount(){
    this.chart.on('rangeselectend', (ev)=>{
      console.log(ev.selected.refprice);
      // avoid miss
      if(ev.selected.refprice){
        this.props.dispatch({type: 'smartselect/filterParcel', priceRange:ev.selected.refprice});
      }
    })
  }

  shouldComponentUpdate(nextProps){
    if(nextProps.data !== this.props.data){
      return true;
    } else {return false}
  }
  render() {
    console.log(this.props)
    return (<this.Chart {...this.props} />);
  }
}

export default class QuerySlider extends Component {
  render(){
    console.log(this.props)
    return (
      <Paper
        zDepth={3}
        style={paperStyle}
      >
        <HigherChart {...this.props}/>

        {/* <Slider range step={1} defaultrefprice={[20, 50]} min={0} max={421}
            style={sliderStyle}
        /> */}
      </Paper>
      );
    }
  };
