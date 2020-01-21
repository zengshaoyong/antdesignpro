import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
// export async function queryCurrent() {
//   return request('/api/currentUser');
// }

export async function queryCurrent() {
  return request('http://127.0.0.1:5000/currentUser');
}


export async function queryNotices() {
  return request('/api/notices');
}
