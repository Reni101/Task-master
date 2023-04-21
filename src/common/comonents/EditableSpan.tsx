import React, {ChangeEvent, KeyboardEvent, useState} from 'react'
import {TextField} from '@mui/material'
import {TaskStatuses} from 'common/enums/enums'


type EditableSpanPropsType = {
    title: string
    callBack: (newTitle: string) => void
    status?:TaskStatuses
}


export const EditableSpan = (props: EditableSpanPropsType) => {
    const [error, setError] = useState<boolean>(false)
    const [newTitle, setNewTitle] = useState<string>(props.title)
    const [edit, setEdit] = useState(false)


    const EditTrueHAndler = () => {
        setEdit(!edit)
        ChangeTitleHandler()
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
        if (error && e.currentTarget.value.trim()) {
            setError(false)
        }
    }
    const pressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        e.key === 'Enter' && EditTrueHAndler()
    }

    const ChangeTitleHandler = () => {
        let taskTitle: string = newTitle.trim()
        if (taskTitle !== '') {
            props.callBack(taskTitle)
        } else {
            setError(true)
        }
    }
    const taskClasses = props.status === 2 ? 'is-done' : ''

    return (
        edit
            ? <TextField id='standard-basic'
                         label='Редактировать текст'
                         variant='standard'
                         onChange={onChangeHandler}
                         onBlur={EditTrueHAndler}
                         autoFocus type='text'
                         onKeyDown={pressEnter}
                         value={newTitle}
                         size='small'
                         style={{margin:'6px',}}
            />

            : <span className={taskClasses} style={{fontSize:'20px'}}
                    onDoubleClick={EditTrueHAndler}> {props.title}
                {error && <div style={{color: 'red'}}>Title is required!</div>}
            </span>

    )
}
