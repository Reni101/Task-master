import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAppAsyncThunk } from 'common/utils/create-app-async-thunk'
import { authAPI, LoginParamsType } from 'common/api/auth-api'
import { ResultCode } from 'common/enums/enums'
import { clearState } from 'common/actions/common-actions'

const login = createAppAsyncThunk<void, LoginParamsType>(
  'authReducer/login',
  async (params, { dispatch, rejectWithValue }) => {
    const res = await authAPI.login(params)
    if (res.resultCode === 0) {
      dispatch(authActions.setIsLoggedIn({ value: true }))
      return
    } else {
      return rejectWithValue({ data: res, showGlobalError: false })
    }
  }
)

const logout = createAppAsyncThunk(
  'authReducer/logout',
  async (_, { dispatch, rejectWithValue }) => {
    const res = await authAPI.logout()
    if (res.resultCode === ResultCode.Success) {
      dispatch(authActions.setIsLoggedIn({ value: false }))
      dispatch(clearState())
      return
    } else {
      return rejectWithValue({ data: res, showGlobalError: true })
    }
  }
)

const slice = createSlice({
  name: 'authReducer',
  initialState: { isLoggedIn: false },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    }
  }
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = { login, logout }
