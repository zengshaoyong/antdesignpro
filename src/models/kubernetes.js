import {k8s} from '@/services/kubernetes';

const K8sModel = {
  namespace: 'kubernetes',
  state: {
    data: [],
  },
  effects: {
    * fetchk8s({payload, callback}, {call, put}) {

      const response = yield call(k8s, payload);
      // console.log('response', response)
      // eslint-disable-next-line eqeqeq
      if (response.status == '200') {
        yield put({
          type: 'save',
          payload: {
            data: response.data
          },
        });
        if (callback) callback();
      }
    },
  },
  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    }
  },
};
export default K8sModel;
