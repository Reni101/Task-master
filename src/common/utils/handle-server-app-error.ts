import {appActions} from 'app/app-reducer'
import {ResponseType} from 'common/api/baseURL'
import {Dispatch} from '@reduxjs/toolkit'

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError: boolean = true
) => {
    if (showError) {
        dispatch(appActions.setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
    }
}