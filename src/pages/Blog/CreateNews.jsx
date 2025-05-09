import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { createNewsAPI } from '~/apis/index.js'
import { useNavigate } from 'react-router-dom'
import { Toast } from '~/utils/toast'

function CreateNewsForm() {
  const navigate = useNavigate()

  const formSchema = z.object({
    title: z.string().min(1, { message: 'Tiêu đề không được để trống!' }),
    content: z.string().min(1, { message: 'Nội dung không được để trống!' }),
    image: z
      .instanceof(File)
      .refine((file) => file.size <= 5 * 1024 * 1024, { message: 'Ảnh phải nhỏ hơn 5MB!' })
      .refine((file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type), {
        message: 'Chỉ hỗ trợ định dạng JPEG, PNG hoặc GIF!'
      })
      .optional(),
    author_id: z.coerce.number().optional()
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      image: undefined,
      author_id: undefined
    }
  })

  const handleCreateNews = async (data) => {
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('content', data.content)
      if (data.image) {
        formData.append('image', data.image)
      }
      if (data.author_id) {
        formData.append('author_id', data.author_id)
      }

      await createNewsAPI(formData)
      Toast.fire({ icon: 'success', text: 'Đã tạo bài viết thành công!' })
      navigate('/blog')
    } catch (error) {
      Toast.fire({ icon: 'error', text: 'Tạo bài viết thất bại!' })
    }
  }

  return (
    <div className="page-heading">
      <div className="page-title">
        <h3>Thêm bài viết</h3>
        <p className="text-subtitle text-muted">Tạo mới một bài viết tin tức</p>
      </div>

      <section>
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Form tạo bài viết</h4>
          </div>
          <div className="card-body">
            <form noValidate onSubmit={handleSubmit(handleCreateNews)}>
              {/* Title */}
              <div className="form-group">
                <label htmlFor="title">Tiêu đề</label>
                <input
                  id="title"
                  type="text"
                  className={clsx('form-control', { 'is-invalid': errors.title })}
                  {...register('title')}
                  placeholder="Nhập tiêu đề"
                  required
                />
                {errors.title && <p className="text-danger">{errors.title.message}</p>}
              </div>

              {/* Content */}
              <div className="form-group">
                <label htmlFor="content">Nội dung</label>
                <textarea
                  id="content"
                  rows={6}
                  className={clsx('form-control', { 'is-invalid': errors.content })}
                  {...register('content')}
                  placeholder="Nhập nội dung bài viết"
                  required
                />
                {errors.content && <p className="text-danger">{errors.content.message}</p>}
              </div>

              {/* image */}
              <div className="form-group">
                <label htmlFor="image">Ảnh minh họa</label>
                <input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  className={clsx('form-control', { 'is-invalid': errors.image })}
                  onChange={(e) => {
                    const file = e.target.files[0]
                    setValue('image', file, { shouldValidate: true })
                  }}
                />
                {errors.image && <p className="text-danger">{errors.image.message}</p>}
              </div>

              {/* Author ID (tùy chọn cho admin) */}
              {/* 
              <div className="form-group">
                <label htmlFor="author_id">ID người đăng</label>
                <input
                  id="author_id"
                  type="number"
                  className={clsx('form-control', { 'is-invalid': errors.author_id })}
                  {...register('author_id')}
                  placeholder="ID người dùng (nếu có)"
                />
                {errors.author_id && <p className="text-danger">{errors.author_id.message}</p>}
              </div>
              */}

              {/* Buttons */}
              <div className="d-flex justify-content-end mt-3">
                <button type="submit" className="btn btn-primary me-2">
                  Tạo bài viết
                </button>
                <button type="reset" className="btn btn-secondary">
                  Làm lại
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CreateNewsForm