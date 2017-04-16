import dva from 'dva';

import { browserHistory } from 'dva/router';
import { createHashHistory } from 'history';


// import createLoading from 'dva-loading';
import Index from './routes/IndexPage';

import './index.css';

// 1. Initialize
const app = dva({
history: browserHistory
});
// 2. Plugins
// app.use(createLoading());

// 3. Model
app.model(require('./models/smartselect'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
