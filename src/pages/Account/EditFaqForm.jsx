import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { updateAccountAPI } from '~/apis'
import { useLocation, useNavigate } from 'react-router-dom'
import { Toast } from '~/utils/toast'
import { useState } from 'react'
import { API_ROOT } from '~/utils/constants'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE, PHONE_RULE, PHONE_RULE_MESSAGE } from '~/utils/validators'

function EditAccountForm() {
  const navigate = useNavigate()
  const account = useLocation().state.account

  const [imageUrl, setImageUrl] = useState(account.avatar ? (API_ROOT + account?.avatar) : null)
  const [imageFile, setImageFile] = useState(null)
  const handleInputAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImageFile(file)
      setImageUrl(url)
    }
  }

  const formSchema = z.object({
    name: z.string().min(1, { message: FIELD_REQUIRED_MESSAGE }),
    email: z.string().min(1, { message: FIELD_REQUIRED_MESSAGE }).regex(EMAIL_RULE, { message: EMAIL_RULE_MESSAGE }),
    phone: z.string().regex(PHONE_RULE, { message: PHONE_RULE_MESSAGE }).or(z.literal('')).optional(),
    address: z.string().or(z.literal('')).optional(),
    newPassword: z.string().regex(PASSWORD_RULE, { message: PASSWORD_RULE_MESSAGE }).or(z.literal('')).optional(),
    status: z.enum(['active', 'inactive'], {
      errorMap: () => ({ message: FIELD_REQUIRED_MESSAGE })
    })
  })
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: account.name,
      email: account.email,
      phone: account.phone || '',
      address: account.address || '',
      newPassword: '',
      status: account.status
    }
  })

  const handleEditAccount = (data) => {
    let formData = null
    if (imageFile) {
      formData = new FormData()
      formData.append('avatar', imageFile)
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('phone', data.phone)
      formData.append('address', data.address)
      formData.append('status', data.status)
      formData.append('newPassword', data.newPassword)
      formData.append('id', account.id)
    } else {
      formData = { ...data, id: account.id }
    }
    updateAccountAPI(formData).then(() => {
      Toast.fire({
        icon: 'success',
        text: 'Update Successfully!'
      })
      navigate('/account')
    })
  }


  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Edit Account</h3>
            <p className="text-subtitle text-muted">
              Edit a Account section
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
                  Accounts
                </li>
                <li className="breadcrumb-item active" aria-current="page">Edit Account</li>
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
                <h4 className="card-title">Edit Form</h4>
              </div>
              <div className="card-content">
                <div className="card-body">
                  <form className="form" noValidate onSubmit={handleSubmit(handleEditAccount)}>
                    <div className="row">
                      <div className="col-md-6 col-12">
                        <div className="form-group mandatory">
                          <label htmlFor="name" className="form-label">Name</label>
                          <input
                            type="text"
                            id="name"
                            className={clsx('form-control', { 'is-invalid': errors.name })}
                            placeholder="Type name..."
                            name="name"
                            {...register('name')}
                          />
                          {errors.name && <p className="text-danger">{errors.name.message}</p>}
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="form-group mandatory">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input
                            type="text"
                            id="email"
                            className={clsx('form-control', { 'is-invalid': errors.email })}
                            placeholder="Type email..."
                            name="email"
                            {...register('email')}
                          />
                          {errors.email && <p className="text-danger">{errors.email.message}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 col-12">
                        <div className="form-group mandatory">
                          <label htmlFor="phone" className="form-label">Phone</label>
                          <input
                            type="phone"
                            id="phone"
                            className={clsx('form-control', { 'is-invalid': errors.phone })}
                            placeholder="Type phone..."
                            name="phone"
                            {...register('phone')}
                          />
                          {errors.phone && <p className="text-danger">{errors.phone.message}</p>}
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="form-group mandatory">
                          <label htmlFor="address" className="form-label">Address</label>
                          <input
                            type="text"
                            id="address"
                            className={clsx('form-control', { 'is-invalid': errors.address })}
                            placeholder="Type address..."
                            name="address"
                            {...register('address')}
                          />
                          {errors.address && <p className="text-danger">{errors.address.message}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 col-12">
                        <div className="form-group mandatory">
                          <label htmlFor="newPassword" className="form-label">New Password</label>
                          <input
                            type="password"
                            id="newPassword"
                            className={clsx('form-control', { 'is-invalid': errors.newPassword })}
                            placeholder="Type new password..."
                            name="newPassword"
                            {...register('newPassword')}
                          />
                          {errors.newPassword && <p className="text-danger">{errors.newPassword.message}</p>}
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="form-group mandatory">
                          <label htmlFor="avatar" className="form-label">Avatar</label>
                          <input
                            type="file"
                            accept='image/*'
                            id="avatar"
                            className={clsx('form-control', { 'is-invalid': errors.avatar })}
                            name="avatar"
                            onChange={handleInputAvatarChange}
                          />
                          <img src={imageUrl} style={{ width: '50px', marginTop: '1rem' }} className={`${!imageUrl ? 'd-none': ''}`}/>
                          {errors.avatar && <p className="text-danger">{errors.avatar.message}</p>}
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

export default EditAccountForm