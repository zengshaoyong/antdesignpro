import {Mysql, Instance} from "@/services/mysql";
import {message} from "antd";

const MysqlModel = {
  namespace: 'mysql',
  state: {
    data: [],
    instance: '',
  },

  effects: {
    * fetchInstance({payload}, {call, put}) {
      const response = yield call(Instance, payload);
      // console.log('response', response)
      if (response.status == '200') {
        yield put({
          type: 'save',
          payload: {
            instance: response.data
          },
        });
      } else {
        message.error(response.data, 10)
      }
    },

    * fetchMysql({payload}, {call, put}) {
      // console.log('payload', payload)
      const response = yield call(Mysql, payload);
      // console.log('response', response)
      if (response.status == '200') {
        yield put({
          type: 'save',
          payload: {
            data: response.data
          },
        });
      }
      if (response.status == '201') {
        message.success(response.data, 10)
      }
      if (response.status == '400') {
        message.error(response.data, 10)
      }
    },

    * resetData({payload}, {call, put}) {
      yield put({
        type: 'delete',
        payload: {
          data: [],
        },
      });
    },

  },

  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    },
    delete(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    },
  },
};
export default MysqlModel;
