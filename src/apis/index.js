import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import { Toast } from '~/utils/toast'

/**
 * Test API
 * @author levi
 */
export const testAPI = async () => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/api/test`)
}

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

/**
 * Blog APIs (RESTful)
 * @author khiem
 */

// Lấy danh sách tất cả bài viết
export const fetchAllNewsAPI = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/api/blog`)
  return res
}

// Xem chi tiết bài viết
export const fetchNewsDetailAPI = async (id) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/api/blog/${id}`)
  return res
}

// Tìm kiếm bài viết
export const searchNewsAPI = async (keyword) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/api/blog/search`, {
    params: { keyword }
  })
  return res
}

// Thêm bài viết
export const createNewsAPI = async (data, showToast = true) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/api/blog/create`, data)
  if (showToast) {
    Toast.fire({ icon: 'success', text: 'Đã thêm bài viết' })
  }
  return res
}

// Cập nhật bài viết
export const updateNewsAPI = async (data, showToast = true) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/api/blog/${data.id}`, data)
  if (showToast) {
    Toast.fire({ icon: 'success', text: 'Đã cập nhật bài viết' })
  }
  return res
}

// Xoá bài viết
export const deleteNewsAPI = async (id, showToast = true) => {
  const res = await authorizedAxiosInstance.delete(`${API_ROOT}/api/blog/${id}`)
  if (showToast) {
    Toast.fire({ icon: 'success', text: 'Đã xoá bài viết' })
  }
  return res
}

/**
 * Comment APIs (RESTful)
 */

// Lấy bình luận theo bài viết
export const fetchCommentsByNewsAPI = async (news_id) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/api/blog/${news_id}/comments`)
  return res
}

// Thêm bình luận vào bài viết
export const createCommentAPI = async (news_id, data, showToast = true) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/api/blog/${news_id}/comments`, data)
  if (showToast) {
    Toast.fire({ icon: 'success', text: 'Đã gửi bình luận' })
  }
  return res
}

// Xoá bình luận theo id
export const deleteCommentAPI = async (id, showToast = true) => {
  const res = await authorizedAxiosInstance.delete(`${API_ROOT}/api/comments/${id}`)
  if (showToast) {
    Toast.fire({ icon: 'success', text: 'Đã xoá bình luận' })
  }
  return res
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
