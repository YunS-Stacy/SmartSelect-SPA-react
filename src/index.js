import dva from 'dva';

import { browserHistory } from 'dva/router';
import { message } from 'antd';

import { useRouterHistory } from 'dva/router';
import { createHashHistory } from 'history';

import './index.css';

const ERROR_MSG_DURATION = 3; //3 seconds


// 1. Initialize
const app = dva({
  history: useRouterHistory(createHashHistory)({ queryKey: false }),
  onError(e) {
     message.error(e.message, ERROR_MSG_DURATION);
   },
});
// 2. Plugins
// app.use(createLoading());

// 3. Model
app.model(require('./models/smartselect'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
