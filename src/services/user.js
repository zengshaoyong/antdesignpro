import request from '@/utils/request';

let PYTHONAPI = window.requestURL || '';

export async function query() {
  return request('/api/users');
}
// export async function queryCurrent() {
//   return request('/api/currentUser');
// }

export async function queryCurrent() {
  return request(`${PYTHONAPI}/currentUser`);
}


export async function queryNotices() {
  return request('/api/notices');
}
