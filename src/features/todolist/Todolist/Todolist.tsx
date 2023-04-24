import React, { FC, memo } from 'react'
import { TaskType } from 'common/api/task-api'
import {
  FilterValuesType,
  todolistActions,
  todolistThunks,
} from 'features/todolist/todolists-reducer'
import { EditableSpan } from 'common/comonents/EditableSpan'
import IconButton from '@mui/material/IconButton'
import { Delete } from '@mui/icons-material'
import { AddItemForm } from 'common/comonents/AddItemForm'
import Button from '@mui/material/Button'
import { RequestStatusType } from 'app/app-reducer'
import { tasksThunks } from 'features/todolist/Todolist/Task/tasks-reducer'
import { Task } from 'features/todolist/Todolist/Task/Task'
import { TaskStatuses } from 'common/enums/enums'
import { useActions } from 'common/hooks/useActions'

type TodoListPropsType = {
  todolistId: string
  title: string
  entityStatus: RequestStatusType
  tasks: TaskType[]
  filter: FilterValuesType
}
export const Todolist: FC<TodoListPropsType> = memo(
  ({ todolistId, title, entityStatus, filter, tasks }) => {
    const { editTitleTodoList, removeTodoList, addTask, changeFilter } = useActions({
      ...todolistThunks,
      ...todolistActions,
      ...tasksThunks,
    })

    let tasksForRender = tasks
    if (filter === 'active') {
      tasksForRender = tasks.filter((t) => t.status === TaskStatuses.New)
    }
    if (filter === 'completed') {
      tasksForRender = tasks.filter((t) => t.status === TaskStatuses.Completed)
    }

    const editTodolistHandler = (newTitle: string) => {
      editTitleTodoList({ title: newTitle, todolistId })
    }

    const removeTodoListHandler = () => {
      removeTodoList(todolistId)
    }

    const changeFilterHandler = (todolistId: string, filter: FilterValuesType) => {
      changeFilter({ id: todolistId, filter })
    }

    const addTaskHandler = (title: string) => {
      addTask({ todolistId, title })
    }

    const buttonClassALL = filter === 'all' ? 'outlined' : 'contained'
    const buttonClassActive = filter === 'active' ? 'outlined' : 'contained'
    const buttonClassCompleted = filter === 'completed' ? 'outlined' : 'contained'

    const tasksMap = tasks.length
      ? tasksForRender.map((t) => {
          return <Task key={t.id} task={t} />
        })
      : null

    return (
      <div>
        <h3>
          <EditableSpan title={title} callBack={editTodolistHandler} />
          <IconButton
            aria-label='delete'
            onClick={removeTodoListHandler}
            disabled={entityStatus === 'loading'}
          >
            <Delete />
          </IconButton>
        </h3>
        <AddItemForm callBack={addTaskHandler} disabled={entityStatus === 'loading'} />
        <div>{tasksMap}</div>

        <div>
          <Button variant={buttonClassALL} onClick={() => changeFilterHandler(todolistId, 'all')}>
            All
          </Button>
          <Button
            variant={buttonClassActive}
            onClick={() => changeFilterHandler(todolistId, 'active')}
          >
            Active
          </Button>
          <Button
            variant={buttonClassCompleted}
            onClick={() => changeFilterHandler(todolistId, 'completed')}
          >
            Completed
          </Button>
        </div>
      </div>
    )
  }
)
