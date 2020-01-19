import request from '@/utils/request';

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
  return request('http://127.0.0.1:5000/login', {
    method: 'POST',
    data: params,
  });
}

