import React from 'react';
import { Router, Route } from 'dva/router';
import Index from './routes/IndexPage';
import Portfolio from './routes/Portfolio';

export default function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={Index} />
      <Route path="/portfolio" component={Portfolio} />
    </Router>
  );
};
