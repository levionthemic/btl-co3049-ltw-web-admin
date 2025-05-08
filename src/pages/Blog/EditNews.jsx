import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { updateNewsAPI } from '~/apis/index.js'
import { useLocation, useNavigate } from 'react-router-dom'
import { Toast } from '~/utils/toast'

function EditNewsForm() {
  const navigate = useNavigate()
  const news = useLocation().state.news

  const formSchema = z.object({
    title: z.string().min(1, { message: 'Tiêu đề không được để trống!' }),
    content: z.string().min(1, { message: 'Nội dung không được để trống!' }),
    status: z.enum(['draft', 'published'], {
      errorMap: () => ({ message: 'Vui lòng chọn trạng thái!' })
    })
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: news.title,
      content: news.content,
      status: news.status
    }
  })

  const handleEditNews = async (data) => {
    try {
      await updateNewsAPI({ ...data, id: news.id })
      Toast.fire({ icon: 'success', text: 'Cập nhật bài viết thành công!' })
      navigate('/admin/news')
    } catch (err) {
      Toast.fire({ icon: 'error', text: 'Cập nhật thất bại!' })
    }
  }

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Chỉnh sửa bài viết</h3>
            <p className="text-subtitle text-muted">Cập nhật nội dung tin tức</p>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav aria-label="breadcrumb" className="breadcrumb-header float-start float-lg-end">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                <li className="breadcrumb-item"><a href="/admin/news">Bài viết</a></li>
                <li className="breadcrumb-item active" aria-current="page">Chỉnh sửa</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <section>
        <div className="row match-height">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Form chỉnh sửa</h4>
              </div>
              <div className="card-content">
                <div className="card-body">
                  <form className="form" noValidate onSubmit={handleSubmit(handleEditNews)}>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group mandatory">
                          <label htmlFor="title" className="form-label">Tiêu đề</label>
                          <textarea
                            id="title"
                            className={clsx('form-control', { 'is-invalid': errors.title })}
                            placeholder="Nhập tiêu đề..."
                            {...register('title')}
                          />
                          {errors.title && <p className="text-danger">{errors.title.message}</p>}
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group mandatory">
                          <label htmlFor="content" className="form-label">Nội dung</label>
                          <textarea
                            id="content"
                            rows={6}
                            className={clsx('form-control', { 'is-invalid': errors.content })}
                            placeholder="Nhập nội dung bài viết..."
                            {...register('content')}
                          />
                          {errors.content && <p className="text-danger">{errors.content.message}</p>}
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group mandatory">
                          <label className="form-label">Trạng thái</label>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              value="draft"
                              {...register('status')}
                            />
                            <label className="form-check-label">Nháp</label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              value="published"
                              {...register('status')}
                            />
                            <label className="form-check-label">Đã đăng</label>
                          </div>
                          {errors.status && <p className="text-danger">{errors.status.message}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <button type="submit" className="btn btn-primary me-2 mt-3">Cập nhật</button>
                      <button type="reset" className="btn btn-secondary mt-3">Làm lại</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EditNewsForm
