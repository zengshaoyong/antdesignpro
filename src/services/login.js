import request from '@/utils/request';
import config from "../../public/config"


export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function realLogin(params) {
  // console.log(config)
  return request(`${window.requestURL}/login`, {
    method: 'POST',
    data: params,
  });
}

export async function Logout() {
  return request(`${window.requestURL}/logout`);
}


