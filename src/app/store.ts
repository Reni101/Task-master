import { AnyAction, combineReducers, configureStore, ThunkDispatch } from '@reduxjs/toolkit'
import { appReducer } from 'app/app-reducer'
import { authReducer } from 'features/auth/auth.reducer'
import { todoListsReducer } from 'features/todolist/Todolist/todolists-reducer'
import { tasksReducer } from 'features/todolist/Todolist/Task/tasks-reducer'

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  todolists: todoListsReducer,
  tasks: tasksReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>

// @ts-ignore
window.store = store
