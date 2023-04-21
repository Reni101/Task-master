import {AnyAction, combineReducers, configureStore, ThunkDispatch} from '@reduxjs/toolkit'
import {appReducer} from 'app/app-reducer'
import {authReducer} from 'features/auth/auth.reducer'

const rootReducer = combineReducers({
    app: appReducer,
    auth:authReducer,
})

export const store = configureStore({
    reducer: rootReducer,
})

export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>

// @ts-ignore
window.store = store