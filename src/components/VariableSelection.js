import React, { Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';

import './css/background.css';

import Corrplot from '../components/Corrplot'

export default class VariableSelection extends Component {

  static propTypes = {
    id: React.PropTypes.string,
  };

  static defaultProps = {
    className: 'background',
  };

  getBlockChildren = (item, i) =>(
    <li key={i} id={`${this.props.id}-block${i}`}>
      <h3>{item.title}</h3>
      <p>{item.content}</p>
    </li>);

    render() {
      const props = { ...this.props };
      delete props.isMode;
      // const dataSource = [
      //   { title: 'About', content: aboutContent
      //   // , icon: 'https://zos.alipayobjects.com/rmsportal/YPMsLQuCEXtuEkmXTTdk.png'
      // },
      //   { title: 'Problem', content: problemContent },
      //   { title: 'Solution', content: solutionContent },
      //
      // ];
      // const listChildren = dataSource.map(this.getBlockChildren);

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
              {/* {listChildren} */}
              <Corrplot />
            </QueueAnim>
          </OverPack>
        </div>
      );
    }
  };
