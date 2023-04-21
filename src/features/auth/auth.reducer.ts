import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAppAsyncThunk } from 'common/utils/create-app-async-thunk'
import { authAPI, LoginParamsType } from 'common/api/auth-api'
import { thunkTryCatch } from 'common/utils/thunk-try-catch'
import { handleServerAppError } from 'common/utils/handle-server-app-error'
import { ResultCode } from 'common/enums/enums'
import { clearState } from 'common/actions/common-actions'

const login = createAppAsyncThunk<any, LoginParamsType>(
  'authReducer/login',
  async (params, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    return thunkTryCatch(thunkAPI, async () => {
      const res = await authAPI.login(params)
      if (res.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ value: true }))
        return
      } else {
        handleServerAppError(res, dispatch)
        return rejectWithValue(null)
      }
    })
  }
)

const logout = createAppAsyncThunk('authReducer/logout', async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI

  return thunkTryCatch(thunkAPI, async () => {
    const res = await authAPI.logout()
    if (res.resultCode === ResultCode.Success) {
      dispatch(authActions.setIsLoggedIn({ value: false }))
      dispatch(clearState())
      return
    } else {
      handleServerAppError(res, dispatch)
      return rejectWithValue(null)
    }
  })
})

const slice = createSlice({
  name: 'authReducer',
  initialState: { isLoggedIn: false },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    },
  },
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = { login, logout }
