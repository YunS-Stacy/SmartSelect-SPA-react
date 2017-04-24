import React, { Component } from 'react';
import Joyride from 'react-joyride';

import MappingPanel from '../components/MappingPanel';
import LayerToggle from '../components/LayerToggle';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      joyrideOverlay: true,
      joyrideType: 'continuous',
      isReady: false,
      isRunning: false,
      stepIndex: 0,
      steps: [],
      selector: '',
    };
  }

	componentDidMount() {
    const steps = [
      {
        title: 'Trigger Action',
        text: 'It can be `click` (default) or `hover` <i>(reverts to click on touch devices</i>.',
        selector: '.card-comments',
        position: 'top',
        type: 'hover',
      },
      {
        title: 'Advance customization',
        text: 'You can set individual styling options for beacons and tooltips. <br/>To advance click `NEXT` inside the hole.',
        selector: '.card-tickets',
        position: 'bottom',
        allowClicksThruHole: true,
        style: {
          backgroundColor: '#ccc',
          mainColor: '#000',
          header: {
            color: '#f04',
            fontSize: '3rem',
            textAlign: 'center',
          },
          footer: {
            display: 'none',
          },
          beacon: {
            inner: '#000',
            outer: '#000',
          },
        },
      },
    ];

    if (location.hostname === 'localhost') {
      steps.push(
        {
          title: 'Tasks',
          text: 'Hey look! Tasks!',
          selector: '.card-tasks',
          position: 'right',
        },
        {
          title: 'Orders',
          text: 'Mo\' Money',
          selector: '.card-orders',
          position: 'left',
        }
      );
    }

    this.props.addSteps(steps);
  }

  handleClick = (e) => {
    e.preventDefault();
    const { next } = this.props;

    next();
  }

  render() {
    const { selector } = this.props;
    let commentLink = (
      <span className="pull-right">
        <i className="fa fa-arrow-circle-right" />
      </span>
    );

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isReady: true,
        isRunning: true,
      });
    }, 1000);
  }

  addSteps(steps) {
    let newSteps = steps;

    if (!Array.isArray(newSteps)) {
      newSteps = [newSteps];
    }

    if (!newSteps.length) {
      return;
    }

    // Force setState to be synchronous to keep step order.
    this.setState(currentState => {
      currentState.steps = currentState.steps.concat(newSteps);
      return currentState;
    });
  }

  addTooltip(data) {
    this.joyride.addTooltip(data);
  }

  next() {
    this.joyride.next();
  }

  callback(data) {
    console.log('%ccallback', 'color: #47AAAC; font-weight: bold; font-size: 13px;'); //eslint-disable-line no-console
    console.log(data); //eslint-disable-line no-console

    this.setState({
      selector: data.type === 'tooltip:before' ? data.step.selector : '',
    });
  }

  onClickSwitch(e) {
    e.preventDefault();
    const el = e.currentTarget;
    const state = {};

    if (el.dataset.key === 'joyrideType') {
      this.joyride.reset();

      setTimeout(() => {
        this.setState({
          isRunning: true,
        });
      }, 300);

      state.joyrideType = e.currentTarget.dataset.type;
    }

    if (el.dataset.key === 'joyrideOverlay') {
      state.joyrideOverlay = el.dataset.type === 'active';
    }

    this.setState(state);
  }

  render() {
    const {
      isReady,
      isRunning,
      joyrideOverlay,
      joyrideType,
      selector,
      stepIndex,
      steps,
    } = this.state;
    let html;

    if (isReady) {
      html = (
        <div>
          <Joyride
            ref={c => (this.joyride = c)}
            callback={this.callback}
            debug={false}
            disableOverlay={selector === '.card-tickets'}
            locale={{
              back: (<span>Back</span>),
              close: (<span>Close</span>),
              last: (<span>Last</span>),
              next: (<span>Next</span>),
              skip: (<span>Skip</span>),
            }}
            run={isRunning}
            showOverlay={joyrideOverlay}
            showSkipButton={true}
            showStepsProgress={true}
            stepIndex={stepIndex}
            steps={steps}
            type={joyrideType}
          />
          {/* <MappingPanel
            joyrideType={joyrideType}
            joyrideOverlay={joyrideOverlay}
            onClickSwitch={this.onClickSwitch}
            addSteps={this.addSteps}
            addTooltip={this.addTooltip}
          /> */}
					<LayerToggle
            joyrideType={joyrideType}
            joyrideOverlay={joyrideOverlay}
            onClickSwitch={this.onClickSwitch}
            addSteps={this.addSteps}
            addTooltip={this.addTooltip}
          />
        </div>
      );
    } else {
      html = (<div></div>);
    }

    return (
      <div key="App" className="app">{html}</div>
    );
  }
}
