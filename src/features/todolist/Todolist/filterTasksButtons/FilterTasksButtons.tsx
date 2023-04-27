import React, { FC, memo } from 'react'
import Button from '@mui/material/Button'
import { FilterValuesType, todolistActions } from 'features/todolist/Todolist/todolists-reducer'
import { useActions } from 'common/hooks/useActions'

type Props = {
  filter: FilterValuesType
  todolistId: string
}

export const FilterTasksButtons: FC<Props> = memo(({ filter, todolistId }) => {
  const { changeFilter } = useActions(todolistActions)

  const buttonClassALL = filter === 'all' ? 'outlined' : 'contained'
  const buttonClassActive = filter === 'active' ? 'outlined' : 'contained'
  const buttonClassCompleted = filter === 'completed' ? 'outlined' : 'contained'

  const changeFilterHandler = (todolistId: string, filter: FilterValuesType) => {
    changeFilter({ id: todolistId, filter })
  }

  return (
    <>
      <Button variant={buttonClassALL} onClick={() => changeFilterHandler(todolistId, 'all')}>
        All
      </Button>
      <Button variant={buttonClassActive} onClick={() => changeFilterHandler(todolistId, 'active')}>
        Active
      </Button>
      <Button
        variant={buttonClassCompleted}
        onClick={() => changeFilterHandler(todolistId, 'completed')}
      >
        Completed
      </Button>
    </>
  )
})
