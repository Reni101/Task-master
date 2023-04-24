import FormControl from '@mui/material/FormControl/FormControl'
import Grid from '@mui/material/Grid/Grid'
import { useAppSelector } from 'common/hooks/useApp'
import React from 'react'
import { selectIsLoggedIn } from 'features/auth/auth-selectors'
import { useFormik } from 'formik'
import { authThunks } from 'features/auth/auth.reducer'
import { Navigate } from 'react-router-dom'
import { Checkbox, FormControlLabel, FormGroup, FormLabel, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import { useActions } from 'common/hooks/useActions'
import { LoginParamsType } from 'common/api/auth-api'

enum ValidateLength {
  minLengthPassword = 3,
}

export const Login = () => {
  const { login } = useActions(authThunks)

  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: (values: LoginParamsType) => {
      const errors: Partial<LoginParamsType> = {}
      if (!values.email) {
        errors.email = 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      }

      if (!values.password) {
        errors.password = 'Required'
      } else if (values.password.length < ValidateLength.minLengthPassword) {
        errors.password = `password must be at least ${ValidateLength.minLengthPassword} characters long `
      }
      return errors
    },
    onSubmit: async (values) => {
      login(values)
    },
  })

  if (isLoggedIn) {
    return <Navigate to='/' />
  }

  return (
    <Grid container justifyContent={'center'}>
      <Grid item justifyContent={'center'}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <a
                  href={'https://social-network.samuraijs.com/'}
                  target={'_blank'}
                  rel='noreferrer'
                >
                  {' '}
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField label='Email' margin='normal' {...formik.getFieldProps('email')} />
              {formik.touched.email && formik.errors.email && (
                <div style={{ color: 'red' }}>{formik.errors.email}</div>
              )}

              <TextField
                type='password'
                label='Password'
                margin='normal'
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <div style={{ color: 'red' }}>{formik.errors.password}</div>
              )}
              <FormControlLabel
                label={'Remember me'}
                control={
                  <Checkbox
                    checked={formik.values.rememberMe}
                    {...formik.getFieldProps('rememberMe')}
                  />
                }
              />

              <Button type={'submit'} variant={'contained'} color={'primary'}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}
