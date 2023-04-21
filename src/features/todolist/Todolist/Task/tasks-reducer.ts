
import { modelType, taskApi, TaskType } from 'common/api/task-api'
import { clearState } from 'common/actions/common-actions'
import { todolistThunks } from 'features/todolist/todolists-reducer'
import { createAppAsyncThunk } from 'common/utils/create-app-async-thunk'
import { thunkTryCatch } from 'common/utils/thunk-try-catch'
import { ResultCode } from 'common/enums/enums'
import { handleServerAppError } from 'common/utils/handle-server-app-error'
import { appActions } from 'app/app-reducer'
import {createSlice} from '@reduxjs/toolkit'

export type TasksType = {
  [key: string]: TaskType[]
}

const getTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  'tasksReducer/setTasks',
  async (todolistId, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
      const res = await taskApi.getTasks(todolistId)
      return { tasks: res.items, todolistId }
    })
  }
)

const removeTask = createAppAsyncThunk<
  { todolistId: string; taskId: string },
  { todolistId: string; taskId: string }
>('tasksReducer/removeTask', async (params, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  const { todolistId, taskId } = params
  return thunkTryCatch(thunkAPI, async () => {
    const res = await taskApi.deleteTask(todolistId, taskId)
    if (res.resultCode === ResultCode.Success) {
      return { taskId, todolistId }
    } else {
      handleServerAppError(res, dispatch)
      return rejectWithValue(null)
    }
  })
})

export const updateTask = createAppAsyncThunk<
  TaskType,
  { taskId: string; todolistId: string; model: modelType }
>('tasksReducer/updateTask', async (params, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI

  return thunkTryCatch(thunkAPI, async () => {
    const task = getState().tasks[params.todolistId].find((t) => t.id === params.taskId)
    if (!task) {
      dispatch(appActions.setAppError({ error: 'Task not found' }))
    }

    const apiModel: modelType = { ...task, ...params.model }

    const res = await taskApi.updateTask(params.todolistId, params.taskId, apiModel)
    if (res.resultCode === ResultCode.Success) {
      return res.data.item
    } else {
      handleServerAppError(res, dispatch)
      return rejectWithValue(null)
    }
  })
})

const addTask = createAppAsyncThunk<{ task: TaskType }, { todolistId: string; title: string }>(
  'tasksReducer/addTask',
  async (params, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    return thunkTryCatch(thunkAPI, async () => {
      const res = await taskApi.addTaskForTodolist(params.todolistId, params.title)
      if (res.resultCode === ResultCode.Success) {
        return { task: res.data.item }
      } else {
        handleServerAppError(res, dispatch)
        return rejectWithValue(null)
      }
    })
  }
)

const slice = createSlice({
  name: 'tasksReducer',
  initialState: {} as TasksType,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(todolistThunks.addTodoList.fulfilled, (state, action) => {
      state[action.payload.newTodolist.id] = []
    })
    builder.addCase(todolistThunks.removeTodoList.fulfilled, (state, action) => {
      delete state[action.payload.id]
    })
    builder.addCase(todolistThunks.getTodoList.fulfilled, (state, action) => {
      action.payload.todoLists.forEach((tl) => (state[tl.id] = []))
    })
    builder.addCase(getTasks.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks
    })
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((el) => el.id === action.payload.taskId)
      if (index > -1) tasks.splice(index, 1)
    })
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const tasks = state[action.payload.todoListId]
      const index = tasks.findIndex((el) => el.id === action.payload.id)
      if (index > -1) {
        tasks[index] = action.payload
      }
    })
    builder.addCase(addTask.fulfilled, (state, action) => {
      state[action.payload.task.todoListId].unshift(action.payload.task)
    })
    builder.addCase(clearState.type, () => {
      return {}
    })
  },
})

export const tasksReducer = slice.reducer
export const tasksThunks = { getTasks, removeTask, updateTask, addTask }
