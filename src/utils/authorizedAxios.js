import axios from 'axios'
import { logoutUserAPI, refreshTokenAPI } from '~/apis'
import { Toast } from './toast'

let authorizedAxiosInstance = axios.create()
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
authorizedAxiosInstance.defaults.withCredentials = true

let logout = null
export const initLogout = (mainLogout) => (logout = mainLogout)

authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

let refreshTokenPromise = null
authorizedAxiosInstance.interceptors.response.use(
  (response) => { return response },
  (error) => {

    if (error?.response.status == 401) {
      logout()
      logoutUserAPI()
    }

    const originalRequests = error.config
    if (error?.response?.status === 410 && originalRequests) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            return data?.accessToken
          })
          .catch(_error => {
            logout()
            logoutUserAPI(false)
            return Promise.reject(_error)
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }
      return refreshTokenPromise.then(() => {
        return authorizedAxiosInstance(originalRequests)
      })
    }

    if (error?.response.status != 410) {
      Toast.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || error?.message
      })
    }

    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance