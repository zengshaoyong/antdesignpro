import request from '@/utils/request';

export async function k8s(payload) {
  return request(`http://127.0.0.1:5000/k8s?task=${payload.task}&name=${payload.name}&container_name=${payload.container_name}&image=${payload.image}&yaml=${payload.yaml}`);
}
