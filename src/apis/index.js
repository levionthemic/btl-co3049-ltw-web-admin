import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import { Toast } from '~/utils/toast'

/**
 * User APIs
 * @author levi
 */
export const loginUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/auth/login`, data)
  return response
}

export const logoutUserAPI = async (showToast = true) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/auth/logout`)
  if (showToast) {
    Toast.fire({
      icon: 'success',
      text: 'Logout successfully!'
    })
  }
  return response
}

export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/auth/register`, data)
  return response
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/auth/refresh-token`)
  return response
}

export const fetchAllUsersAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/users`)
  return response
}

export const updateAccountAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/admin/user/edit`, data)
  return response
}

export const deleteAccountAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/admin/user/delete/${id}`)
  return response
}

/**
 * FAQ APIs
 * @author levi
 */
export const fetchAllFaqsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/faq`)
  return response
}

export const createFaqAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/faq/add`, data)
  return response
}

export const updateFaqAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/api/faq/edit`, data)
  return response
}

export const deleteFaqAPI = async (faqId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/faq/delete/${faqId}`)
  return response
}

export const getRoomsAPI = async (params) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/rooms`, {
    params
  })
  return response
}

export const getBookingsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/rooms/get-bookings`)
  return response
}

export const deleteRoomAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/rooms/delete/${id}`)
  return response
}

export const updateRoomAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/rooms/update-room/${id}`, data)
  return response
}

export const createRoomAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/rooms/create-room`, data)
  return response
}

export const deleteBookingAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/rooms/delete-booking/${id}`)
  return response
}


export const updateBookingAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/rooms/update-booking`, data)
  return response
}
