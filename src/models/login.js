import {stringify} from 'querystring';
import router from 'umi/router';
import {fakeAccountLogin, getFakeCaptcha} from '@/services/login';
import {realLogin} from '@/services/login';
import {setAuthority} from '@/utils/authority';
import {setRoute} from "@/utils/authority";
import {getPageQuery} from '@/utils/utils';
import {message} from "antd";

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    * login({payload}, {call, put}) {
      // console.log('payload', payload)
      // const response = yield call(fakeAccountLogin, payload);
      const response = yield call(realLogin, payload);
      // console.log(payload)
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      // console.log('payload', response)
      if (response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let {redirect} = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        router.replace(redirect || '/');
      }
      if (response.status != 'ok') {
        message.error(response.message, 5)
      }
    },

    * getCaptcha({payload}, {call}) {
      yield call(getFakeCaptcha, payload);
    },

    logout() {
      const {redirect} = getPageQuery(); // Note: There may be security issues, please note

      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, {payload}) {
      setAuthority(payload.currentAuthority);
      // setRoute(payload.menu)
      return {...state, status: payload.status, type: payload.type};
    },
  },
};
export default Model;
