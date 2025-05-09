import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  fetchCommentsByNewsAPI,
  deleteCommentAPI,
  createCommentAPI
} from '~/apis/index.js'
import { Toast } from '~/utils/toast'

function NewsComments() {
  const { id } = useParams() // ID bài viết
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  const fetchComments = () => {
    fetchCommentsByNewsAPI(id)
      .then((res) => {
        console.log('Comments data:', res) // Debug dữ liệu
        if (res.data.status === 'success' && Array.isArray(res.data.data)) {
          setComments(res.data.data)
        } else {
          setComments([])
          console.error('Invalid comments data:', res.data)
        }
      })
      .catch((err) => {
        console.error('Fetch comments error:', err)
        Toast.fire({ icon: 'error', text: 'Lỗi tải bình luận!' })
      })
  }

  useEffect(() => {
    fetchComments()
  }, [id])

  const handleDelete = async (commentId) => {
    try {
      await deleteCommentAPI(commentId)
      Toast.fire({ icon: 'success', text: 'Đã xoá bình luận!' })
      fetchComments()
    } catch (err) {
      Toast.fire({ icon: 'error', text: 'Xoá thất bại!' })
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    const userId = localStorage.getItem('userId')
    if (!userId) {
      Toast.fire({ icon: 'warning', text: 'Vui lòng đăng nhập để bình luận!' })
      return
    }
    try {
      await createCommentAPI(id, { content: newComment, user_id: userId })
      Toast.fire({ icon: 'success', text: 'Đã thêm bình luận!' })
      setNewComment('')
      fetchComments()
    } catch (err) {
      Toast.fire({ icon: 'error', text: 'Thêm bình luận thất bại!' })
    }
  }

  console.log('Rendering comments:', comments) // Debug render

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý bình luận - Bài viết #{id}</h2>

      {/*<div className="mb-4">
        <textarea
          className="w-full border p-2"
          placeholder="Viết bình luận mới..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Gửi bình luận
        </button>
      </div>*/}

      <table className="min-w-full bg-white border" style={{ border: '1px solid black' }}>
        <thead>
          <tr>
            <th className="border px-4 py-2">Người dùng</th>
            <th className="border px-4 py-2">Nội dung</th>
            <th className="border px-4 py-2">Ngày</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {comments.length > 0 ? (
            comments.map(comment => (
              <tr key={comment.id}>
                <td className="border px-4 py-2">{comment.user_id}</td>
                <td className="border px-4 py-2">{comment.content}</td>
                <td className="border px-4 py-2">{comment.created_at}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-600"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border px-4 py-2 text-center">
                Chưa có bình luận
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default NewsComments