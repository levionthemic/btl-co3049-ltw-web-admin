import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from 'simple-datatables'
import {
  fetchAllNewsAPI,
  searchNewsAPI,
  deleteNewsAPI
} from '~/apis/index.js'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBin3Line } from 'react-icons/ri'
import Swal from 'sweetalert2'
import { Toast } from '~/utils/toast'

function Blog() {
  const tableRef = useRef(null)
  const dataTableRef = useRef(null)
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const loadData = async () => {
    try {
      const res = await fetchAllNewsAPI()
      setData(res.data.data || res.data)
    } catch (err) {
      Toast.fire({ icon: 'error', title: 'Không thể tải bài viết' })
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) return loadData()
    try {
      const res = await searchNewsAPI(searchTerm)
      setData(res.data.data)
    } catch (err) {
      Toast.fire({ icon: 'error', title: 'Tìm kiếm thất bại' })
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!tableRef.current || !data.length) return

    if (dataTableRef.current) {
      dataTableRef.current.destroy()
    }

    dataTableRef.current = new DataTable(tableRef.current)

    return () => {
      dataTableRef.current?.destroy()
    }
  }, [data])

  const handleEdit = (id) => {
    navigate(`/blog/editnews/${id}`)
  }

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Xoá bài viết?',
      text: 'Bạn có chắc muốn xoá bài viết này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Huỷ'
    })

    if (confirm.isConfirmed) {
      try {
        await deleteNewsAPI(id)
        setData(prev => prev.filter(news => news.id !== id))
        Toast.fire({ icon: 'success', title: 'Đã xoá bài viết.' })
      } catch (err) {
        Toast.fire({ icon: 'error', title: 'Xoá thất bại.' })
      }
    }
  }

  return (
    <div className="page-heading">
      <div className="page-title">
        <h3>Quản lý bài viết</h3>
      </div>
      <section className="section">
        <div className="card">
          <div className="card-header d-flex justify-between items-center">
            <h5>Danh sách bài viết</h5>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn btn-primary" onClick={() => navigate('/blog/create')}>
                Thêm bài viết
              </button>
            </div>
          </div>

          <div className="card-body">
            <table ref={tableRef} className="table table-striped" id="table-news">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tiêu đề</th>
                  <th>Mô tả</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {data?.map(news => (
                  <tr key={news.id} data-id={news.id}>
                    <td>{news.id}</td>
                    <td>{news.title}</td>
                    <td>{news.description || news.content?.slice(0, 50) + '...'}</td>
                    <td>{news.created_at}</td>
                    <td>{news.status === 'published' ? 'Đã đăng' : 'Nháp'}</td>
                    <td className="d-flex align-items-center gap-2">
                      <FiEdit
                        className="text-warning"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleEdit(news.id)}
                      />
                      <RiDeleteBin3Line
                        className="text-danger"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDelete(news.id)}
                      />
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => navigate(`/admin/news/${news.id}/comments`)}
                      >
                        Bình luận
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Blog
