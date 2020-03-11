import request from '@/utils/request';


export async function Audit(payload) {
  return request(`${window.requestURL}/audit?username=${payload.username}&st_time=${payload.st_time}&end_time=${payload.end_time}`);
}

export async function Audit_redis(payload) {
  return request(`${window.requestURL}/audit_redis?username=${payload.username}&st_time=${payload.st_time}&end_time=${payload.end_time}`);
}
