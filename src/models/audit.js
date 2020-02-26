import {Audit} from "@/services/audit";


const AuditModel = {
  namespace: 'audit',
  state: {
    data: [],
  },

  effects: {
    * fetchAudit({payload}, {call, put}) {
      const response = yield call(Audit, payload);
      // console.log('response', response)
      if (response.status == '200') {
        yield put({
          type: 'save',
          payload: {
            data: response.data
          },
        });
      } else {
        message.error(response.data, 10)
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
export default AuditModel;
