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
  const [editingComment, setEditingComment] = useState(null)
  const [editedContent, setEditedContent] = useState('')

  const fetchComments = () => {
    fetchCommentsByNewsAPI(id)
      .then((res) => setComments(res.data))
      .catch(() => Toast.fire({ icon: 'error', text: 'Lỗi tải bình luận!' }))
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

  const handleEdit = (comment) => {
    setEditingComment(comment)
    setEditedContent(comment.content)
  }

  const handleUpdate = async () => {
    try {
      await createCommentAPI({ id: editingComment.id, content: editedContent })
      Toast.fire({ icon: 'success', text: 'Đã gửi bình luận!' })
      setEditingComment(null)
      fetchComments()
    } catch (err) {
      Toast.fire({ icon: 'error', text: 'Thất bại!' })
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý bình luận - Bài viết #{id}</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Người dùng</th>
            <th className="border px-4 py-2">Nội dung</th>
            <th className="border px-4 py-2">Ngày</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {comments.map(comment => (
            <tr key={comment.id}>
              <td className="border px-4 py-2">{comment.userName}</td>
              <td className="border px-4 py-2">
                {editingComment?.id === comment.id ? (
                  <textarea
                    className="w-full border p-1"
                    value={editedContent}
                    onChange={e => setEditedContent(e.target.value)}
                  />
                ) : (
                  comment.content
                )}
              </td>
              <td className="border px-4 py-2">{comment.created_at}</td>
              <td className="border px-4 py-2 space-x-2">
                {editingComment?.id === comment.id ? (
                  <>
                    <button onClick={handleUpdate} className="text-green-600">Lưu</button>
                    <button onClick={() => setEditingComment(null)} className="text-gray-500">Huỷ</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(comment)} className="text-blue-600">Sửa</button>
                    <button onClick={() => handleDelete(comment.id)} className="text-red-600">Xoá</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default NewsComments
