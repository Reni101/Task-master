import { AxiosResponse } from 'axios'
import {instance, ResponseType} from './baseURL'


export const authAPI = {
  login(data: LoginParamsType) {
    return instance
      .post<LoginParamsType, AxiosResponse<ResponseType<{ userId: number }>>>(
        '/auth/login',
        data
      )
      .then((res) => res.data)
  },
  logout() {
    return instance.delete<ResponseType>('/auth/login').then((res) => res.data)
  },

  me() {
    return instance
      .get<ResponseType<{ id: string; email: string; login: string }>>(
        '/auth/me'
      )
      .then((res) => res.data)
  },
}

export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};
