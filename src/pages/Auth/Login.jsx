import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { loginUserAPI } from '~/apis'
import '~/assets/scss/pages/auth.scss'
import logo from '~/assets/static/images/logo/logo.svg'
import { useAuth } from '~/contexts/AuthContext'
import { Toast } from '~/utils/toast'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'

function Login() {
  const navigate = useNavigate()
  const { currentUser, setUser } = useAuth()

  const formSchema = z.object({
    email: z.string().min(1, { message: FIELD_REQUIRED_MESSAGE }).regex(EMAIL_RULE, { message: EMAIL_RULE_MESSAGE }),
    password: z.string().min(1, { message: FIELD_REQUIRED_MESSAGE }).regex(PASSWORD_RULE, { message: PASSWORD_RULE_MESSAGE })
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const handleLogin = (data) => {
    loginUserAPI({ ...data, role: 'admin', rememberMe: false }).then((res) => {
      Toast.fire({
        icon: 'success',
        text: 'Login Successfully!'
      })
      setUser(res.data.data.user)
      navigate('/')
    })
  }

  useEffect(() => {
    if (currentUser)
      navigate('/', { replace: true })
  }, [currentUser, navigate])

  return (
    <div id='auth'>
      <div className="row h-100">
        <div className="col-lg-5 col-12">
          <div id="auth-left">
            <div className="auth-logo">
              <a href="index.html"><img src={logo} alt="Logo"/></a>
            </div>
            <h1 className="auth-title">Log in.</h1>
            <p className="auth-subtitle mb-5">Log in with your data that you entered during registration.</p>

            <form noValidate onSubmit={form.handleSubmit(handleLogin)}>
              <div className="form-group position-relative has-icon-left mb-4">
                <input
                  type="text"
                  className={clsx(
                    'form-control form-control-xl',
                    {
                      'is-invalid': form.formState.errors['email']
                    }
                  )}
                  placeholder="Email"
                  {...form.register('email')}
                />
                <div className="form-control-icon">
                  <i className="bi bi-person"></i>
                </div>
                {form.formState.errors.email && <p className="text-danger">{form.formState.errors.email.message}</p>}
              </div>
              <div className="form-group position-relative has-icon-left mb-4">
                <input
                  type="password"
                  className={clsx(
                    'form-control form-control-xl',
                    {
                      'is-invalid': form.formState.errors['email']
                    }
                  )}
                  placeholder="Password"
                  {...form.register('password')}
                />
                <div className="form-control-icon">
                  <i className="bi bi-shield-lock"></i>
                </div>
                {form.formState.errors.password && <p className="text-danger">{form.formState.errors.password.message}</p>}
              </div>
              <div className="form-check form-check-lg d-flex align-items-end">
                <input className="form-check-input me-2" type="checkbox" value="" id="flexCheckDefault"/>
                <label className="form-check-label text-gray-600" htmlFor="flexCheckDefault">
                  Keep me logged in
                </label>
              </div>
              <button className="btn btn-primary btn-block btn-lg shadow-lg mt-5">Log in</button>
            </form>
            <div className="text-center mt-5 text-lg fs-4">
              <p className="text-gray-600">Don&apos;t have an account? <a href="auth-register.html" className="font-bold">Sign
                        up</a>.</p>
              <p><a className="font-bold" href="auth-forgot-password.html">Forgot password?</a>.</p>
            </div>
          </div>
        </div>
        <div className="col-lg-7 d-none d-lg-block">
          <div id="auth-right">

          </div>
        </div>
      </div>
    </div>
  )
}

export default Login