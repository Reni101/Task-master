import { todolistAPI, TodolistType } from 'common/api/todolist-api'
import { RequestStatusType } from 'app/app-reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { clearState } from 'common/actions/common-actions'
import { createAppAsyncThunk } from 'common/utils/create-app-async-thunk'
import { thunkTryCatch } from 'common/utils/thunk-try-catch'
import { ResultCode } from 'common/enums/enums'
import { handleServerAppError } from 'common/utils/handle-server-app-error'
import { tasksThunks } from 'features/todolist/Todolist/Task/tasks-reducer'

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

const initialState: TodolistDomainType[] = []

const getTodoList = createAppAsyncThunk<{ todoLists: TodolistType[] }>(
  'todoListsReducer/getTodoList',
  async (_, thunkAPI) => {
    const { dispatch } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.getTodoLists()

      res.data.forEach((tl) => {
        dispatch(tasksThunks.getTasks(tl.id))
      })
      return { todoLists: res.data }
    })
  }
)

const addTodoList = createAppAsyncThunk<{ newTodolist: TodolistType }, string>(
  'todoListsReducer/addTodoList',
  async (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.createTodolist(title)
      if (res.data.resultCode === ResultCode.Success) {
        return { newTodolist: res.data.data.item }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  }
)

const removeTodoList = createAppAsyncThunk<{ id: string }, string>(
  'todoListsReducer/removeTodoList',
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    return thunkTryCatch(thunkAPI, async () => {
      dispatch(
        todolistActions.changeTodolistEntityStatus({
          status: 'loading',
          todolistId,
        })
      )

      const res = await todolistAPI.deleteTodolist(todolistId)
      if (res.data.resultCode === ResultCode.Success) {
        return { id: todolistId }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  }
)

const editTitleTodoList = createAppAsyncThunk<
  { title: string; id: string },
  { todolistId: string; title: string }
>('todoListsReducer/editTitleTodoList', async (param, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI

  return thunkTryCatch(thunkAPI, async () => {
    const res = await todolistAPI.updateTodolistTitle(param.todolistId, param.title)
    if (res.data.resultCode === ResultCode.Success) {
      return {
        title: param.title,
        id: param.todolistId,
      }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  })
})

const slice = createSlice({
  name: 'todoListsReducer',
  initialState: initialState,
  reducers: {
    changeFilter(state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) {
      const index = state.findIndex((el) => el.id === action.payload.id)
      state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatus(
      state,
      action: PayloadAction<{ todolistId: string; status: RequestStatusType }>
    ) {
      const index = state.findIndex((el) => el.id === action.payload.todolistId)
      state[index].entityStatus = action.payload.status
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearState.type, () => {
      return []
    })
    builder.addCase(getTodoList.fulfilled, (state, action) => {
      return action.payload.todoLists.map((tl) => ({
        ...tl,
        filter: 'all',
        entityStatus: 'idle',
      }))
    })
    builder.addCase(addTodoList.fulfilled, (state, action) => {
      state.unshift({
        ...action.payload.newTodolist,
        filter: 'all',
        entityStatus: 'idle',
      })
    })
    builder.addCase(removeTodoList.fulfilled, (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id)
      if (index > -1) {
        state.splice(index, 1)
      }
    })
    builder.addCase(editTitleTodoList.fulfilled, (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id)
      state[index].title = action.payload.title
    })
  },
})

export const todoListsReducer = slice.reducer
export const todolistActions = slice.actions
export const todolistThunks = { getTodoList, addTodoList, removeTodoList, editTitleTodoList }
