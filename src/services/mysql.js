import request from '@/utils/request';


export async function Instance(payload) {
  return request(`${window.requestURL}/instance`);
}

export async function Mysql(params) {
  return request(`${window.requestURL}/mysql`, {
    method: 'POST',
    data: params,
  });
}
