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
import { BiCommentDetail } from 'react-icons/bi'


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
    tableRef.current.addEventListener('click', function (e) {
      const target = e.target
      const row = target.closest('tr')
      const id = row?.getAttribute('data-id')

      if (!id) return

      if (target.closest('.edit-icon')) {
        navigate(`/blog/edit/${id}`)
      }

      if (target.closest('.delete-icon')) {
        Swal.fire({
          title: 'Xoá bài viết?',
          text: 'Bạn có chắc muốn xoá bài viết này?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Xoá',
          cancelButtonText: 'Huỷ'
        }).then((result) => {
          if (result.isConfirmed) {
            deleteNewsAPI(id).then(() => {
              setData(prev => prev.filter(news => news.id.toString() !== id))
              Toast.fire({ icon: 'success', title: 'Đã xoá bài viết.' })
            })
          }
        })
      }

      if (target.closest('.comment-icon')) {
        navigate(`/blog/${id}/comments`)
      }
    })

    if (!tableRef.current || !data.length) return

    // Xoá bảng cũ nếu có
    if (dataTableRef.current) {
      dataTableRef.current.destroy()
      dataTableRef.current = null
    }

    // Khởi tạo lại bảng mới
    dataTableRef.current = new DataTable(tableRef.current, {
      searchable: true,
      perPageSelect: [5, 10, 20],
      perPage: 10
    })

    return () => {
      dataTableRef.current?.destroy()
    }
  }, [data])

  return (
    <div className="page-heading">
      <div className="page-title">
        <h3>Quản lý bài viết</h3>
      </div>
      <section className="section">
        <div className="card">
          <div className="card-header flex justify-between items-center w-full">
            <h5 className="text-lg font-semibold flex-shrink-0">Danh sách bài viết</h5>
            <button
              className="btn btn-primary flex-grow"
              onClick={() => navigate('/blog/create')}
            >
            Thêm bài viết
            </button>
          </div>


          <div className="card-body">
            <table ref={tableRef} className="table table-striped" id="table-news">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tiêu đề</th>
                  <th>Mô tả</th>
                  <th>Ngày tạo</th>
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
                    <td className="d-flex align-items-center gap-2">
                      <FiEdit className="edit-icon text-warning me-2" style={{ cursor: 'pointer' }} />
                      <RiDeleteBin3Line className="delete-icon text-danger" style={{ cursor: 'pointer' }} />
                      <BiCommentDetail className="comment-icon text-info" style={{ cursor: 'pointer' }} />
                      {/*<button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => navigate(`/blog/${news.id}/comments`)}
                      >
                        Bình luận
                      </button>*/}
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
