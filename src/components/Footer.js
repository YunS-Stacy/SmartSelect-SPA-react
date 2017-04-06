import React from 'react';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import './css/footer.css';


export default class Footer extends React.Component {

  static defaultProps = {
    className: 'footer',
  };

  render() {
    const props = { ...this.props };
    delete props.isMode;
    return (<OverPack
      {...props}
      playScale={0.05}
      // hideProps={{ footer: { reverse: true } }}
            >
      <TweenOne
        animation={{ y: '+=30', opacity: 0, type: 'from' }}
        key="footer"
      >
        <span id={`${props.id}-content`}>
          Project by <a>Yun Shi</a>.
        </span>
      </TweenOne>
    </OverPack>);
  }
};
