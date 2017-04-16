import React, {Component} from 'react';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';

export default class Footer extends Component {
  render() {
    const props = { ...this.props };
    delete props.isMode;
    return (<OverPack
      {...props}
      playScale={0.05}
            >
      <TweenOne
        animation={{ y: '+=30', opacity: 0, type: 'from' }}
        key="footer"
      >
        <span id={`${props.id}-content`}>
          Capstone Project by Yun Shi.
          MUSA 17', University of Pennsylvania
        </span>
      </TweenOne>
    </OverPack>);
  }
};
