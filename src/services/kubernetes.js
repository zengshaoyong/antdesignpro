import request from '@/utils/request';

let PYTHONAPI = window.requestURL || '';

export async function k8s(payload) {
  return request(`${PYTHONAPI}/k8s?task=${payload.task}&name=${payload.name}&container_name=${payload.container_name}&image=${payload.image}&yaml=${payload.yaml}`);
}
