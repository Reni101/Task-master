import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAppAsyncThunk } from 'common/utils/create-app-async-thunk'
import { authAPI } from 'common/api/auth-api'
import { ResultCode } from 'common/enums/enums'
import { handleServerNetworkError } from 'common/utils/handle-server-network-error'
import { authActions } from 'features/auth/auth.reducer'

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export const initializeApp = createAppAsyncThunk(
  'appReducer/initializeApp',
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    try {
      const res = await authAPI.me()
      if (res.resultCode === ResultCode.Success) {
        dispatch(authActions.setIsLoggedIn({ value: true }))
      } else {
        dispatch(appActions.setAppStatus({ status: 'failed' }))
        dispatch(authActions.setIsLoggedIn({ value: false }))
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    } finally {
      dispatch(appActions.setIsInitialized({ value: true }))
    }
  }
)

const slice = createSlice({
  name: 'appReducer',
  initialState: {
    status: 'loading' as RequestStatusType,
    error: null as string | null,
    isInitialized: false as boolean,
  },
  reducers: {
    setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    setAppError(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error
    },
    setIsInitialized(state, action: PayloadAction<{ value: boolean }>) {
      state.isInitialized = action.payload.value
    },
  },
})

export const appReducer = slice.reducer
export const appActions = slice.actions
export const appThunks = { initializeApp }
