import request from "@/utils/request";

export async function Redis(payload) {
  return request(`${window.requestURL}/redis?key=${payload.key}&type=${payload.type}&redis=${payload.instance}`);
}
