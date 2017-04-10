import React, { Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';

import './css/background.css';

import Corrplot from '../components/Corrplot'

export default class VariableSelection extends Component {

    render() {
      const props = { ...this.props };
      delete props.isMode;
      return (
        <div
          id = 'Info'
          {...props}
          className={`content-template-wrapper ${props.className}-wrapper`}
        >
          <OverPack
            className={`content-template ${props.className}`}
            location={props.id}
          >
            <TweenOne
              animation={{ y: '+=30', opacity: 0, type: 'from' }}
              component="h1"
              key="h1"
              reverseDelay={300}
              id={`${props.id}-title`}
            >
              Variable Selection
            </TweenOne>
            <QueueAnim
              component="ul" type="bottom" key="block" leaveReverse
              id={`${props.id}-contentWrapper`}
            >
              <Corrplot />
            </QueueAnim>
          </OverPack>
        </div>
      );
    }
  };
