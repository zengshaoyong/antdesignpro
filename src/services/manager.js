import request from '@/utils/request';


export async function manager_mysql(payload) {
  return request(`${window.requestURL}/manage_mysql?type=${payload.type}&ip=${payload.ip}&port=${payload.port}&read_user=${payload.read_user}&read_password=${payload.read_password}&execute_user=${payload.execute_user}&execute_password=${payload.execute_password}&instance=${payload.instance}`);
}


export async function manager_redis(payload) {
  return request(`${window.requestURL}/manage_redis?type=${payload.type}&ip=${payload.ip}&port=${payload.port}&name=${payload.name}&password=${payload.password}`);
}


