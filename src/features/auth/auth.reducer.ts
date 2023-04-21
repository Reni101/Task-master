import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {createAppAsyncThunk} from 'common/utils/create-app-async-thunk'


export const login =createAppAsyncThunk('authReducer/login',async ()=>{

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
export const authThunk = { login }