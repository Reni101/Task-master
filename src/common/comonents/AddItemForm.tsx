import React, { ChangeEvent, FC, KeyboardEvent, memo, useState } from 'react'
import { Button, TextField } from '@mui/material'

type Props = {
  callBack: (title: string) => void
  disabled?: boolean
}

export const AddItemForm: FC<Props> = memo(({ callBack, disabled }) => {
  const [title, setTitle] = useState<string>('')
  const [error, setError] = useState<boolean>(false)

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
    if (error && e.currentTarget.value.trim() !== null) {
      setError(false)
    }
  }
  const pressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && TaskTestHandler() // &&- И при нажати и тру и она запускаеть функцию
  }
  const TaskTestHandler = () => {
    let taskTitle: string = title.trim()
    if (taskTitle !== '') {
      callBack(taskTitle)
    } else {
      setError(true)
    }

    setTitle('')
  }

  return (
    <div>
      <TextField
        id='outlined-basic'
        label={error ? 'Title is required!' : 'Введите текст'}
        variant='outlined'
        value={title}
        onChange={onChangeHandler}
        onKeyDown={pressEnter}
        error={error}
        size='small'
      />

      <Button
        variant='contained'
        onClick={TaskTestHandler}
        style={{
          maxWidth: '38px',
          maxHeight: '38px',
          minWidth: '38px',
          minHeight: '38px',
          marginLeft: '5px',
        }}
        disabled={disabled}
      >
        +
      </Button>
    </div>
  )
})
