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
    return (
      <div {...props} className="content-template-wrapper processoverview-wrapper">
        <OverPack
          className={`content-template ${props.className}`}
          location={props.id}
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
          <Row key='workflow'>
            <Workflow/>
          </Row>
          <Row
            type="flex" align="middle" key='model'
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
          </OverPack>
      </div>
    );
  }
}
