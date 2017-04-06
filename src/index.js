import dva from 'dva';
import { connect } from 'dva';

import React from 'react';
import { Router, Route } from 'dva/router';

import createLoading from 'dva-loading';
import Index from './routes/IndexPage';


import './index.css';

// 1. Initialize
const app = dva();

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/smartselect'));

// 4. Router
app.router(({ history })=>
    <Router history={history}>
      <Route path="/" component={Index} />
    </Router>
);
// app.router(require('./router'));

// 5. Start
app.start('#root');
