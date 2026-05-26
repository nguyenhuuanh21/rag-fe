import axios from "axios";

import store from "../redux-setup/store";
import { refreshToken } from "./Api";
import { refreshTokenSuccess, logoutSuccess } from "../redux-setup/reducers/auth";

const Http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  withCredentials: true,
});

let isLoggingOut = false;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

Http.interceptors.request.use(
  (config) => {
    if (config.headers.Authorization) {
      return config;
    }
    const token = store.getState().auth.auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

Http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config, response } = error;

    if (!response) return Promise.reject(error);

    if (response.data?.message === "access token is expired") {
      // Nếu đang refresh → đẩy vào queue chờ token mới
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          config.headers.Authorization = `Bearer ${token}`;
          return Http(config);
        }).catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const newAccessToken = (await refreshToken()).data.accessToken;
        store.dispatch(refreshTokenSuccess({ newAccessToken }));
        console.log('new : ', newAccessToken);

        processQueue(null, newAccessToken);
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return Http(config);
      } catch (e) {
        processQueue(e, null);
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    if (response.data?.message === "access token has been revoked" ||
       response.data?.message === "refresh token has been revoked" || 
       response.data?.message === "refresh token is expired"||
       response.data?.message === "refresh token is required"||
       response.data?.message === "Invalid refresh token") {
      if (!isLoggingOut) {
        isLoggingOut = true;
        store.dispatch(logoutSuccess());
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default Http;