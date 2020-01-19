import request from '@/utils/request';

export async function Instance(payload) {
  return request(`http://127.0.0.1:5000/instance`);
}

export async function Mysql(params) {
  return request('http://127.0.0.1:5000/mysql', {
    method: 'POST',
    data: params,
  });
}
