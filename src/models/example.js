
export default {

  namespace: 'example',

  state: {},

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'query' });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
