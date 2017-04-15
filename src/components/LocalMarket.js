import React, { Component } from 'react';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import g2, { Frame } from 'g2';
import axios from 'axios';

import { Button, Spin} from 'antd';

import SpiralPlot from '../components/SpiralPlot';
import RosePlot from '../components/RosePlot';

import './css/localmarket.css';

export default class LocalMarket extends Component {
  render() {
    const props = { ...this.props };
    const isMode = props.isMode;
    delete props.isMode;
    const queue = isMode ? 'bottom' : 'left';
    const imgAnim = isMode ? { y: 30, opacity: 0, delay: 400, type: 'from', ease: 'easeOutQuad' }
    : { x: 30, opacity: 0, type: 'from', ease: 'easeOutQuad' };
    return (
      <div id="localmarket" key="localmarket" className="localmarket content-template-wrapper localmarket-wrapper" style={{height: '110vh'}}>
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
          <Spin
            spinning={!this.props.dataMarket}
            size='large'
            style={{top: '30%', position: 'absolute'}}
            delay={500}
          >
            <div key='chart'>
              <TweenOne
                className={`${props.className}-img`}
                key="img1"
                animation={imgAnim}
                resetStyleBool
              >
                <SpiralPlot data={this.props.dataMarket.marketPhilly}/>
              </TweenOne>
              <TweenOne
                className={`${props.className}-img`}
                key="img2"
                animation={imgAnim}
                resetStyleBool
              >
                <RosePlot data={this.props.dataMarket.marketNeigh}/>
              </TweenOne>
            </div>
          </Spin>

        </OverPack>
      </div>
    );
  }
}
