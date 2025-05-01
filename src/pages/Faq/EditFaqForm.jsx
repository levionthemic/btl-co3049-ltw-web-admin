import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { updateFaqAPI } from '~/apis'
import { useLocation, useNavigate } from 'react-router-dom'
import { Toast } from '~/utils/toast'

function EditFaqForm() {
  const navigate = useNavigate()
  const faq = useLocation().state.faq

  const formSchema = z.object({
    question: z.string().min(1, { message: 'This field is required!' }),
    answer: z.string().min(1, { message: 'This field is required!' }),
    status: z.enum(['active', 'inactive'], {
      errorMap: () => ({ message: 'Required!' })
    })
  })
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: faq.answer,
      question: faq.question,
      status: faq.status
    }
  })

  const handleEditFaq = (data) => {
    updateFaqAPI({ ...data, id: faq.id }).then(() => {
      Toast.fire({
        icon: 'success',
        text: 'Update Successfully!'
      })
      navigate('/faq')
    })
  }

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Edit FAQ</h3>
            <p className="text-subtitle text-muted">
              Edit a FAQ section
            </p>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                <li className="breadcrumb-item active" aria-current="page">
                  FAQs
                </li>
                <li className="breadcrumb-item active" aria-current="page">Edit FAQ</li>
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
                <h4 className="card-title">Create Form</h4>
              </div>
              <div className="card-content">
                <div className="card-body">
                  <form className="form" noValidate onSubmit={handleSubmit(handleEditFaq)}>
                    <div className="row">
                      <div className="col-md-6 col-12">
                        <div className="form-group mandatory">
                          <label htmlFor="question" className="form-label">Question</label>
                          <textarea
                            type="text"
                            id="question"
                            className={clsx('form-control', { 'is-invalid': errors.question })}
                            placeholder="Type question..."
                            name="question"
                            {...register('question')}
                          />
                          {errors.question && <p className="text-danger">{errors.question.message}</p>}
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="form-group mandatory">
                          <label htmlFor="answer" className="form-label">Answer</label>
                          <textarea
                            type="text"
                            id="answer"
                            className={clsx('form-control', { 'is-invalid': errors.answer })}
                            placeholder="Type answer..."
                            name="answer"
                            {...register('answer')}
                          />
                          {errors.answer && <p className="text-danger">{errors.answer.message}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group mandatory">
                          <fieldset>
                            <label className="form-label">Status</label>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="status"
                                value='active'
                                {...register('status')}
                              />
                              <label
                                className="form-check-label form-label"
                                htmlFor="flexRadioDefault1"
                              >
                                Active
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="status"
                                value='inactive'
                                {...register('status')}
                              />
                              <label
                                className="form-check-label form-label"
                                htmlFor="flexRadioDefault2"
                              >
                                Inactive
                              </label>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary me-1 mb-1">
                          Submit
                        </button>
                        <button
                          type="reset"
                          className="btn btn-light-secondary me-1 mb-1"
                        >
                          Reset
                        </button>
                      </div>
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

export default EditFaqForm