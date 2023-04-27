import { AppDispatch, AppRootStateType } from 'app/store'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ResponseType } from 'common/api/baseURL'
/**
 * This function occurs to eliminate code duplication by type of types in the sled.
 */

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType
  dispatch: AppDispatch
  rejectValue: null | RejectValueType
}>()

export type RejectValueType = {
  data: ResponseType
  showGlobalError: boolean
}
