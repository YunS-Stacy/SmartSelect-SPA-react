import React, { Component } from 'react';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import g2, { Frame } from 'g2';
import axios from 'axios';

import SpiralPlot from '../components/SpiralPlot';
import RosePlot from '../components/RosePlot';

import './css/localmarket.css';

export default class LocalMarket extends Component {
  state={
    datumN: [],
    datumPh: [],
  }

  getBlockChildren = (item, i) =>
  (<li
    key={i}
    id={`${this.props.id}-block${i}`}
   >
    <span>
      <img src={item.img} width="100%" />
    </span>
    <h2>{item.title}</h2>
    <p>{item.content}</p>
  </li>);

    componentWillMount(){
      const self = this;
      axios.get('https://gist.githubusercontent.com/YunS-Stacy/3be63ace8a257281a54e9eb79b374702/raw/ad5e983567072d8ba0e8bdbe4a018b86616fedc9/useRoseChart.json')
      .then(function (response) {
        let data = response.data;
        let frame = new Frame(data);
        let datumPhilly = Frame.filter(frame, function(obj){
          return obj['Region Type'] == 'city'
        });
        let datumPhillyD = Frame.combineColumns(datumPhilly,
          ['Jan_2010', 'Feb_2010', 'Mar_2010', 'Apr_2010', 'May_2010', 'Jun_2010', 'Jul_2010', 'Aug_2010', 'Sep_2010', 'Oct_2010', 'Nov_2010', 'Dec_2010',
          'Jan_2011', 'Feb_2011', 'Mar_2011', 'Apr_2011', 'May_2011', 'Jun_2011', 'Jul_2011', 'Aug_2011', 'Sep_2011', 'Oct_2011', 'Nov_2011', 'Dec_2011',
          'Jan_2012', 'Feb_2012', 'Mar_2012', 'Apr_2012', 'May_2012', 'Jun_2012', 'Jul_2012', 'Aug_2012', 'Sep_2012', 'Oct_2012', 'Nov_2012', 'Dec_2012',
          'Jan_2013', 'Feb_2013', 'Mar_2013', 'Apr_2013', 'May_2013', 'Jun_2013', 'Jul_2013', 'Aug_2013', 'Sep_2013', 'Oct_2013', 'Nov_2013', 'Dec_2013',
          'Jan_2014', 'Feb_2014', 'Mar_2014', 'Apr_2014', 'May_2014', 'Jun_2014', 'Jul_2014', 'Aug_2014', 'Sep_2014', 'Oct_2014', 'Nov_2014', 'Dec_2014',
          'Jan_2015', 'Feb_2015', 'Mar_2015', 'Apr_2015', 'May_2015', 'Jun_2015', 'Jul_2015', 'Aug_2015', 'Sep_2015', 'Oct_2015', 'Nov_2015', 'Dec_2015',
          'Jan_2016', 'Feb_2016', 'Mar_2016', 'Apr_2016', 'May_2016', 'Jun_2016', 'Jul_2016', 'Aug_2016', 'Sep_2016', 'Oct_2016', 'Nov_2016', 'Dec_2016',
          'Jan_2017', 'Feb_2017'], 'valueChange', 'monthYear', ['Region_Name']);
          let datumPh = datumPhillyD.toJSON();
          let datum = Frame.sort(frame,'Feb_2017');
          let datumNeighborhood = Frame.filter(datum, function(obj){
            return obj['Region Type'] == 'neighborhood'
          });
          let datumNeigh = Frame.combineColumns(datumNeighborhood, ['Feb_2017', 'Jan_2017', 'Dec_2016', 'Nov_2016','Oct_2016', 'Sep_2016', 'Aug_2016', 'Jul_2016', 'Jun_2016', 'May_2016', 'Apr_2016', 'Mar_2016', 'Feb_2016', 'Jan_2016', 'Dec_2015', 'Nov_2015', 'Oct_2015', 'Sep_2015', 'Aug_2015', 'Jul_2015', 'Jun_2015', 'May_2015', 'Apr_2015', 'Mar_2015', 'Feb_2015', 'Jan_2015'], 'valueChange', 'monthYear', ['Region_Name']);
          let datumN = datumNeigh.toJSON();
          self.setState({
            datumPh: datumPh,
            datumN: datumN,
          });
        }).catch(function (error) {
          console.log(error);
        });
      }

      render() {
        const props = { ...this.props };
        const isMode = props.isMode;
        const dataSource = [
          { img: 'https://zos.alipayobjects.com/rmsportal/NKBELAOuuKbofDD.png', title: '技术', content: '丰富的技术组件，简单组装即可快速搭建金融级应用，丰富的技术组件，简单组装即可快速搭建金融级应用。' },
          { img: 'https://zos.alipayobjects.com/rmsportal/xMSBjgxBhKfyMWX.png', title: '融合', content: '解放业务及技术生产力，推动金融服务底层创新，推动金融服务底层创新。\n解放业务及技术生产力，推动金融服务底层创新。' },
          { img: 'https://zos.alipayobjects.com/rmsportal/MNdlBNhmDBLuzqp.png', title: '开发', content: '符合金融及要求的安全可靠、高可用、高性能的服务能力，符合金融及要求的安全可靠、高可用、高性能的服务能力。' },
        ];
        const ulChildren = dataSource.map(this.getBlockChildren);
        delete props.isMode;
        const queue = isMode ? 'bottom' : 'left';
        const imgAnim = isMode ? { y: 30, opacity: 0, delay: 400, type: 'from', ease: 'easeOutQuad' }
        : { x: 30, opacity: 0, type: 'from', ease: 'easeOutQuad' };
        return (
          <div {...props} className="content-template-wrapper localmarket-wrapper" style={{overflow: 'auto'}}>
            <OverPack
              className={`content-template ${props.className}`}
              location={props.id}
            >
              <QueueAnim
                className={`${props.className}-text`}
                key="text"
                type={queue}
                leaveReverse
                ease={['easeOutQuad', 'easeInQuad']}
                id={`${props.id}-textWrapper`}
              >
                <h1
                  key="h1"
                  id={`${props.id}-title`}
                >
                  Data Exploration
                </h1>
                <h3
                  key="h3"
                  id={`${props.id}-title`}
                >
                  Local Market
                </h3>

              </QueueAnim>
              <TweenOne
                className={`${props.className}-img`}
                key="img1"
                animation={imgAnim}
                resetStyleBool
              >
                <SpiralPlot data={this.state.datumPh}/>
              </TweenOne>
              <TweenOne
                className={`${props.className}-img`}
                key="img2"
                animation={imgAnim}
                resetStyleBool
              >
                <RosePlot data={this.state.datumN}/>
              </TweenOne>
            </OverPack>
          </div>
                  );
                }
              }
