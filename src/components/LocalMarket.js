import React, { Component } from 'react';

import { Row, Col } from 'antd';

import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import g2, { Frame } from 'g2';
import axios from 'axios';

import { Button, Spin} from 'antd';

import SpiralPlot from '../components/SpiralPlot';
import RosePlot from '../components/RosePlot';

import ListingTable from '../components/ListingTable';


export default class LocalMarket extends Component {

  render() {
    const props = { ...this.props };
    const isMode = props.isMode;
    delete props.isMode;
    const queue = isMode ? 'bottom' : 'left';
    const imgAnim = isMode ? { y: 30, opacity: 0, delay: 400, type: 'from', ease: 'easeOutQuad' }
    : { x: 30, opacity: 0, type: 'from', ease: 'easeOutQuad' };
    return (
      <div id="localmarket" key="localmarket" className="localmarket content-template-wrapper localmarket-wrapper">
        <OverPack
          className={`content-template-wrapper ${props.className}`}
          location={props.id}
        >
          <QueueAnim
            className={`${props.className}-text`}
            key="content"
            type={queue}
            leaveReverse
            ease={['easeOutQuad', 'easeInQuad']}
            id={`${props.id}-textWrapper`}
          >
            <Row
              key='h2'
              type="flex" justify="space-around" align="middle"
            >
              <h2>
                Local Market
              </h2>
            </Row>
            <Row
              key="h3-table"
              id={`${props.id}-title`}
            >
              <Col offset={1}>
                <h3>
                  Lastest Transactions (30 days)
                </h3>
              </Col>
            </Row>
            <Row key='zillow' style={{marginBottom:'2em'}}>
              <Col>
                <ListingTable
                  listing={this.props.listing}
                  imgsrc={this.props.imgsrc}/>
              </Col>

            </Row>
            <Row
              key="h3"
              id={`${props.id}-title`}
            >
              <Col offset={1}>
                <h3>
                  Historical Data
                </h3>
              </Col>
            </Row>

          </QueueAnim>
          <Spin
            key="spin"
            spinning={this.props.dataMarket.marketPhilly.length===0? true:false}
            size='large'
            delay={500}
          >
            <Row
              key='chart'
              type="flex" justify="space-around" align="middle"
            >

              {/* <TweenOne
                className={`${props.className}-img`}
                key="spiralplot"
                animation={imgAnim}
                resetStyleBool
              > */}
              <Col span={10} offset={1}  key='spiralplot'
              >



                <SpiralPlot
                  data={this.props.dataMarket.marketPhilly}
                />

              </Col>
              <Col span={10}  offset={2} key='roseplot'
              >
                <RosePlot
                  data={this.props.dataMarket.marketNeigh}/>
                {/* </TweenOne> */}
              </Col>

            </Row>
          </Spin>


          <Row key='text'>
            <Col
              span={10} offset={1}
              style={{paddingBottom: '5vh'}}
            >
              <p>It can be observed that in Philadelphia, the local housing market maintains a healthy state in recent years, which reflects a stable housing demand.</p>
            </Col>
            <Col
              span={10} offset={2}
              style={{paddingBottom: '5vh'}}
            >
              <p>Location is, unsprisingly, an important factor. The house prices vary wildly from one neighborhood to another.</p>
            </Col>
          </Row>


        </OverPack>
      </div>
    );
  }
}
