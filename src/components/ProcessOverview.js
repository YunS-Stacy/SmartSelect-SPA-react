import React, { Component } from 'react';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';

import Workflow from '../components/Workflow';
import ModelSelection from '../components/ModelSelection';
import ChartPlot from '../components/ChartPlot';

export default class ProcessOverview extends Component {
  render() {
    const props = { ...this.props };
    const isMode = props.isMode;
    delete props.isMode;
    const queue = isMode ? 'bottom' : 'left';
    const imgAnim = isMode ? { y: 30, opacity: 0, delay: 400, type: 'from', ease: 'easeOutQuad' }
    : { x: 30, opacity: 0, type: 'from', ease: 'easeOutQuad' };
    return (
      <div {...props} className="content-template-wrapper processoverview-wrapper"
        style={{height: '150vh', padding: '0 2vw', paddingTop: '10vh'}}
      >
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
              Process Overview
            </h1>
            <h3
              key="h3"
              id={`${props.id}-title`}
            >
              Workflow
            </h3>
          </QueueAnim>
          <TweenOne
            className={`${props.className}-img`}
            key="img1"
            animation={imgAnim}
            resetStyleBool
          >
            <Workflow/>
          </TweenOne>
          <TweenOne
            className={`${props.className}-img`}
            key="img2"
            animation={imgAnim}
            resetStyleBool
          >
            <h3
              key="h3"
              id={`${props.id}-title`}
            >
              K-Fold Cross-Validation (K=5)
            </h3>
            <div style={{display: 'inline-flex'}}>
              <div style={{fontSize: '1.4em'}}>
                <br />
                <br />
                <br />

                The model of Random Forests is the final winner between models, and is chosen to provide the predicted values.
              </div>
              <ChartPlot/>
            </div>
          </TweenOne>
        </OverPack>
      </div>
    );
  }
}
