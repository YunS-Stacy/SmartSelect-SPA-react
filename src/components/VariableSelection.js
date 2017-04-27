import React, { Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';

import {Spin,Row,Col} from 'antd';

import Corrplot from '../components/Corrplot'

export default class VariableSelection extends Component {

    render() {
      const props = { ...this.props };
      delete props.isMode;
      return (
        <Row
          {...props}
          className={`content-template-wrapper ${props.className}-wrapper`}
          style={{height:'100vh'}}
        >
          <OverPack
            className={`content-template-wrapper ${props.className}`}
            location={props.id}
          >
            <TweenOne
              animation={{ y: '+=30', opacity: 0, type: 'from' }}
              key="h3"
              reverseDelay={300}
              id={`${props.id}-title`}
            >
              <Col span={24}>
                <h2>
                  Variable Selection
                </h2>
              </Col>
            </TweenOne>
            <TweenOne
              animation={{ x: '+=30', opacity: 0, type: 'from' }}
              key="corrplot"
              reverseDelay={300}
              id={`${props.id}-chart`}
            >
              <Corrplot
                data={this.props.data}
                forceFit={true}
                width={550}
                height={650}
                plotCfg={{
                      margin: [0,150,150,50]
                }}
              />

            </TweenOne>
          </OverPack>
        </Row>
      );
    }
  };
