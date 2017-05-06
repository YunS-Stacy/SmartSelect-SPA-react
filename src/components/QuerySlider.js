import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Spin, Slider} from 'antd';

import g2, {Stat, Frame} from 'g2';
import createG2 from 'g2-react';

const paperStyle = {
  position: 'absolute',
  top: '75vh',
  left: '0',
  width: '50vw',
  height: '25vh',
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
      // avoid miss
      if(ev.selected.refprice){
        this.props.dispatch({type: 'smartselect/filterParcel', parcelRange:ev.selected.refprice});
      }
    })
  }

  shouldComponentUpdate(nextProps){
    if(nextProps.data !== this.props.data){
      return true;
    } else {return false}
  }
  render() {
    return (<this.Chart {...this.props} />);
  }
}

const legendArray = [
  [0, 'transparent'],

  [69100, 'rgba(12, 44, 132, 1)'],
  [94200, 'rgba(34, 94, 168, 1)'],
  [119000, 'rgba(29, 145, 192, 1)'],
  [141167, 'rgba(65, 182, 196, 1)'],
  [166690, 'rgba(127, 205, 187, 1)'],
  [191400, 'rgba(254, 190, 18, 1)'],
  [225682, 'rgba(238, 131, 110, 1)'],
  [285000, 'rgba(232, 92, 65, 1)'],
  [386940, 'rgba(219, 58, 27, 1)'],
[600000, 'rgba(170, 45, 23, 1)']]

const legendChildren = legendArray.map((item, i) => {
  return (
    <li
      key={i}
      style={{
        borderTopColor: item[1],
        borderTopWidth: '5px',
        borderTopStyle: 'solid',
        fontSize: '0.75em',
        width: '8.5%',
        padding: 0,
        display: 'inline-block',
        textAlign:'end',
        lineHeight: '2.4em'
      }}>
      {`$${item[0]}`}
    </li>
  )
})

export default class QuerySlider extends Component {
  render(){
    return (
        <Paper
          zDepth={3}
          style={paperStyle}
          className='sliderChart'
        >
          {(this.props.data.length !==0 ) && (<HigherChart {...this.props}/>)}
          <div style={{paddingLeft: '1%',bottom: '1em',width: '100%', }}>
            <h6 style={{paddingLeft: '8.5%','lineHeight': '1.8em'}}>Legend</h6>
            <ul>
              {legendChildren}
            </ul>
          </div>
        </Paper>
      );
    }
  };
