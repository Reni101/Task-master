import {useMemo} from 'react'
import {ActionCreator, ActionCreatorsMapObject, bindActionCreators} from 'redux'
import {useAppDispatch} from 'common/hooks/useApp'
import {AsyncThunk} from '@reduxjs/toolkit'


export const useActions = <Actions extends ActionCreatorsMapObject = ActionCreatorsMapObject>
(actions: Actions): BoundActions<Actions> => {
    const dispatch = useAppDispatch()

    return useMemo(() => bindActionCreators(actions, dispatch), [])
}

// Types
type BoundActions<Actions extends ActionCreatorsMapObject> = {
    [key in keyof Actions]: Actions[key] extends AsyncThunk<any, any, any>
        ? BoundAsyncThunk<Actions[key]>
        : Actions[key];
};

type BoundAsyncThunk<Action extends ActionCreator<any>> = (
    ...args: Parameters<Action>
) => ReturnType<ReturnType<Action>>;

