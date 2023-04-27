import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAppAsyncThunk } from 'common/utils/create-app-async-thunk'
import { authAPI } from 'common/api/auth-api'
import { ResultCode } from 'common/enums/enums'
import { authActions } from 'features/auth/auth.reducer'

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export const initializeApp = createAppAsyncThunk(
  'appReducer/initializeApp',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await authAPI.me()
      if (res.resultCode === ResultCode.Success) {
        dispatch(authActions.setIsLoggedIn({ value: true }))
      } else {
        dispatch(authActions.setIsLoggedIn({ value: false }))
        return rejectWithValue({ data: res, showGlobalError: false })
      }
    } finally {
      dispatch(appActions.setIsInitialized({ value: true }))
    }
  }
)

const slice = createSlice({
  name: 'appReducer',
  initialState: {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false as boolean
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
    }
  },
  extraReducers: builder =>
    builder
      .addMatcher(
        action => action.type.endsWith('/pending'),
        state => {
          state.status = 'loading'
        }
      )
      .addMatcher(
        action => action.type.endsWith('/fulfilled'),
        state => {
          state.status = 'succeeded'
        }
      )
      .addMatcher(
        action => action.type.endsWith('/rejected'),
        (state, action) => {
          const { payload, error } = action
          if (payload) {
            if (payload.showGlobalError) {
              state.error = payload.data.messages.length
                ? payload.data.messages[0]
                : 'Some error occurred'
            }
          } else {
            state.error = error.message ? error.message : 'Some error occurred'
          }
          state.status = 'failed'
        }
      )
})

export const appReducer = slice.reducer
export const appActions = slice.actions
export const appThunks = { initializeApp }
