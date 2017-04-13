import React, { Component } from 'react';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import g2, { Frame } from 'g2';

import ChartPlot from '../components/ChartPlot';

import './css/localmarket.css';

export default class ModelSelection extends Component {
  render() {
    const props = { ...this.props };
    const isMode = props.isMode;
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
              Model Selection
            </h1>
            <h3
              key="h3"
              id={`${props.id}-title`}
            >
              K-Fold Cross-Validation Result (k=5)
            </h3>

          </QueueAnim>
          <TweenOne
            className={`${props.className}-img`}
            key="img1"
            animation={imgAnim}
            resetStyleBool
          >
            <ChartPlot/>
          </TweenOne>

        </OverPack>
      </div>
    );
  }
}
