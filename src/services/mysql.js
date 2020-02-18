import request from '@/utils/request';

let PYTHONAPI = window.requestURL || '';

export async function Instance(payload) {
  return request(`${PYTHONAPI}/instance`);
}

export async function Mysql(params) {
  return request(`${PYTHONAPI}/mysql`, {
    method: 'POST',
    data: params,
  });
}
