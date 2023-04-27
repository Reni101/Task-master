import React, { ChangeEvent, FC, KeyboardEvent, memo, useState } from 'react'
import { Button, TextField } from '@mui/material'
import { RejectValueType } from 'common/utils/create-app-async-thunk'

type Props = {
  callBack: (title: string) => any
  disabled?: boolean
}

export const AddItemForm: FC<Props> = memo(({ callBack, disabled }) => {
  const [title, setTitle] = useState<string>('')
  const [error, setError] = useState<string>('')

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
    if (error && e.currentTarget.value.trim() !== null) {
      setError('')
    }
  }
  const pressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && taskTestHandler()
  }
  const taskTestHandler = () => {
    if (title.trim() !== '') {
      callBack(title)
        .then(() => {
          setTitle('')
        })
        .catch((err: RejectValueType) => {
          if (err.data) {
            const messages = err.data.messages
            setError(messages.length ? messages[0] : 'Some error occurred')
          }
        })
    } else {
      setError('Title is required')
    }
  }

  return (
    <div>
      <TextField
        error={!!error}
        id='outlined-basic'
        label={error ? 'Title is required!' : 'Введите текст'}
        variant='outlined'
        value={title}
        onChange={onChangeHandler}
        onKeyDown={pressEnter}
        size='small'
        helperText={error}
      />

      <Button
        variant='contained'
        onClick={taskTestHandler}
        style={{
          maxWidth: '38px',
          maxHeight: '38px',
          minWidth: '38px',
          minHeight: '38px',
          marginLeft: '5px'
        }}
        disabled={disabled}
      >
        +
      </Button>
    </div>
  )
})
