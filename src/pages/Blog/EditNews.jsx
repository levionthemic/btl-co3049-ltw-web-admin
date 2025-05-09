import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { fetchNewsDetailAPI, updateNewsAPI } from '~/apis'
import { useParams, useNavigate } from 'react-router-dom'
import { Toast } from '~/utils/toast'
import { useEffect, useState } from 'react'
import { API_ROOT } from '~/utils/constants'

function EditNewsForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)

  const formSchema = z.object({
    title: z.string().min(1, { message: 'Tiêu đề không được để trống!' }),
    content: z.string().min(1, { message: 'Nội dung không được để trống!' }),
    status: z.enum(['draft', 'published'], {
      errorMap: () => ({ message: 'Vui lòng chọn trạng thái!' })
    }),
    image: z.any().optional() // File ảnh, không yêu cầu URL
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(formSchema)
  })

  useEffect(() => {
    const loadNews = async () => {
      try {
        const res = await fetchNewsDetailAPI(id)
        const newsData = res.data.data
        setNews(newsData)
        setPreviewImage(newsData.image ? `${API_ROOT}/${newsData.image.replace(/^\/+/, '')}` : null)
        reset({
          title: newsData.title,
          content: newsData.content,
          status: newsData.status || 'draft'
        })
      } catch (err) {
        Toast.fire({ icon: 'error', text: 'Không tìm thấy bài viết' })
        navigate('/blog')
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [id, navigate, reset])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPreviewImage(URL.createObjectURL(file))
      setValue('image', file) // Cập nhật giá trị image trong form
    }
  }

  const handleEditNews = async (data) => {
    try {
      const formData = new FormData()
      formData.append('id', id)
      formData.append('title', data.title)
      formData.append('content', data.content)
      formData.append('status', data.status)
      if (data.image instanceof File) {
        formData.append('image', data.image)
      }
      formData.append('_method', 'PUT')
      await updateNewsAPI(formData, id)
      Toast.fire({ icon: 'success', text: 'Cập nhật bài viết thành công!' })
      navigate('/blog')
    } catch (err) {
      console.error('Update error:', err)
      Toast.fire({ icon: 'error', text: 'Cập nhật thất bại!' })
    }
  }

  if (loading) return <p className="text-center mt-5">Đang tải bài viết...</p>

  return (
    <div className="page-heading">
      <div className="page-title">
        <h3>Chỉnh sửa bài viết</h3>
      </div>

      <section>
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Form chỉnh sửa</h4>
          </div>
          <div className="card-body">
            <form noValidate onSubmit={handleSubmit(handleEditNews)}>
              <div className="form-group">
                <label htmlFor="title">Tiêu đề</label>
                <input
                  id="title"
                  type="text"
                  className={clsx('form-control', { 'is-invalid': errors.title })}
                  {...register('title')}
                  placeholder="Nhập tiêu đề"
                />
                {errors.title && <p className="text-danger">{errors.title.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="content">Nội dung</label>
                <textarea
                  id="content"
                  rows={6}
                  className={clsx('form-control', { 'is-invalid': errors.content })}
                  {...register('content')}
                  placeholder="Nhập nội dung"
                />
                {errors.content && <p className="text-danger">{errors.content.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="image">Ảnh bài viết</label>
                {previewImage && (
                  <div className="mb-3">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="img-fluid"
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
                    />
                  </div>
                )}
                <input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  className={clsx('form-control', { 'is-invalid': errors.image })}
                  onChange={handleImageChange}
                />
                {errors.image && <p className="text-danger">{errors.image.message}</p>}
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="draft"
                    {...register('status')}
                    id="status_draft"
                  />
                  <label className="form-check-label" htmlFor="status_draft">Nháp</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="published"
                    {...register('status')}
                    id="status_published"
                  />
                  <label className="form-check-label" htmlFor="status_published">Đã đăng</label>
                </div>
                {errors.status && <p className="text-danger">{errors.status.message}</p>}
              </div>

              <div className="d-flex justify-content-end mt-3">
                <button type="submit" className="btn btn-primary me-2">Cập nhật</button>
                <button type="reset" className="btn btn-secondary">Làm lại</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EditNewsForm