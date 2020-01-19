import request from "@/utils/request";

export async function getauthority(payload) {
  return request(`/api/login/captcha?mobile=${payload.name}`);
}
