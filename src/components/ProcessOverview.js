import React, { Component } from 'react';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';

import { Row, Col } from 'antd';

import Workflow from '../components/Workflow';
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
      <Row {...props} className="content-template-wrapper processoverview-wrapper"
      >
        <OverPack
          className={`content-template ${props.className}`}
          location={props.id}
        >
          <QueueAnim
            key="text"
            type={queue}
            leaveReverse
            ease={['easeOutQuad', 'easeInQuad']}
          >
            <Col span={24} key='h2'>
              <h2>
                Process Overview
              </h2>
            </Col>
            <Col offset={2} span={22} key='h3'>

              <h3
                style={{
                  fontSize: '1.6em',
                  fontWeight: '400',
                  textAlign: 'left',
                }}
              >
                Workflow
              </h3>
            </Col>

          </QueueAnim>
          <Row key='workflow'>
            <TweenOne
              key="img1"
              animation={imgAnim}
              resetStyleBool
            >
              <Workflow/>
            </TweenOne>
          </Row>


          <TweenOne
            key="img2"
            animation={imgAnim}
            resetStyleBool
          >
            <Row
              type="flex" align="middle"
            >
              <Col span={9} offset={2}>
                <h3
                  style={{
                    fontSize: '1.6em',
                    fontWeight: '400',
                    textAlign: 'left',
                  }}
                >
                  Model Performace <br/>
                  K-Fold Cross-Validation (K=5)
                </h3>
                <br></br>
                <br></br>
                <p>
                  The model of Random Forests is the final winner between models, and is chosen to provide the predicted values.
                </p>
              </Col>
              <Col span={9} offset={2}>
                <ChartPlot/>
              </Col>
            </Row>
          </TweenOne>
        </OverPack>
      </Row>
    );
  }
}
