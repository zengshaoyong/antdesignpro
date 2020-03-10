import {Redis} from "@/services/redis";
import {message, notification} from "antd";

const RedisModel = {
  namespace: 'redis',
  state: {
    data: [],
    instance: [],
  },

  effects: {
    * fetchRedisInstance({payload}, {call, put}) {
      const response = yield call(Redis, payload);
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

    * fetchRedis({payload}, {call, put}) {
      // console.log('payload', payload)
      const response = yield call(Redis, payload);
      // console.log('response', response)
      if (response.status == '200') {
        yield put({
          type: 'save',
          payload: {
            data: response.data,
          },
        });
      }
      if (response.status == '400') {
        notification.open({
          message: '执行异常',
          description:
          response.data,
          duration: 0,
          style: {
            width: 600,
            marginLeft: 335 - 600,
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
};
export default RedisModel;
