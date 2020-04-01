import {manager_mysql, manager_redis, manager_user} from "@/services/manager";


const ManagerModel = {
  namespace: 'manager',
  state: {
    data: [],
  },

  effects: {
    * fetchManagerMysql({payload}, {call, put}) {
      const response = yield call(manager_mysql, payload);
      // console.log('response', response)
      if (response.status == '200') {
        yield put({
          type: 'save',
          payload: {
            data: response.data
          },
        });
      }
    },

    * fetchManagerRedis({payload}, {call, put}) {
      const response = yield call(manager_redis, payload);
      // console.log('response', response)
      if (response.status == '200') {
        yield put({
          type: 'save',
          payload: {
            data: response.data
          },
        });
      }
    },

    * fetchManagerUser({payload}, {call, put}) {
      const response = yield call(manager_user, payload);
      // console.log('response', response)
      if (response.status == '200') {
        yield put({
          type: 'save',
          payload: {
            data: response.data
          },
        });
      }
    },

  },

  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    },
  },
}
export default ManagerModel;
