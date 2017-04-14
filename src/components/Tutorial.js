import React, {Component} from 'react';
import { IntroManager } from '@panorama/toolkit';

let introManagerConfig = {
  open: true,
  step: 1,
  config: {
    showStepNumbers: false,
    skipLabel: '×',
    nextLabel: '⟩',
    prevLabel: '⟨',
    doneLabel: '×'
  },

  steps: [
    {
      // "element": ".left-column .top-row.template-tile",
      "element": "#nav",
      "intro": "Some copy describing the first element.",
      "position": "right"
    },
    // {
    //   "element": ".right-column .top-row.template-tile",
    //   "intro": "<p>Some <strong>HTML</strong>copy for the second element.</p>",
    //   "position": "left"
    // },
    // {
    //   "element": ".left-column .bottom-row.template-tile",
    //   "intro": "Saved the best element for last.",
    //   "position": "top"
    // }
  ],

  onExit: () => {
    // @panorama/toolkit components strive to be stateless.
    // Therefore, consumers of IntroManager are expected to
    // pass open/closed state into the component.
    this.setState({
      intro: {
        open: false
      }
    });
  }
}

export default class Tutorial extends Component {
  render() {
    return (<IntroManager {...introManagerConfig}/>);
  }
};
