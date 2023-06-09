import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { selectAppError } from 'app/app-selectors'
import { useAppDispatch, useAppSelector } from 'common/hooks/useApp'
import { appActions } from 'app/app-reducer'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export const ErrorSnackbar = () => {
  const error = useAppSelector(selectAppError)
  const dispatch = useAppDispatch()

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(appActions.setAppError({ error: null }))
  }
  return (
    <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  )
}
