import React, {FC, memo} from 'react'
import {TaskType} from 'common/api/task-api'
import {FilterValuesType, todolistActions, todolistThunks,} from 'features/todolist/todolists-reducer'
import {EditableSpan} from 'common/comonents/EditableSpan'
import IconButton from '@mui/material/IconButton'
import {Delete} from '@mui/icons-material'
import {AddItemForm} from 'common/comonents/AddItemForm'
import Button from '@mui/material/Button'
import {useAppDispatch} from 'common/hooks/useDispatch'
import {RequestStatusType} from 'app/app-reducer'
import {tasksThunks} from 'features/todolist/Todolist/Task/tasks-reducer'
import {Task} from 'features/todolist/Todolist/Task/Task'
import {TaskStatuses} from 'common/enums/enums'

type TodoListPropsType = {
  todolistId: string
  title: string
  entityStatus: RequestStatusType
  tasks: TaskType[]
  filter: FilterValuesType
}
export const Todolist: FC<TodoListPropsType> = memo(
  ({ todolistId, title, entityStatus, filter, tasks }) => {
    const dispatch = useAppDispatch()
    let tasksForRender = tasks
    if (filter === 'active') {
      tasksForRender = tasks.filter((t) => t.status === TaskStatuses.New)
    }
    if (filter === 'completed') {
      tasksForRender = tasks.filter((t) => t.status === TaskStatuses.Completed)
    }

    const editTodolistHandler = (newTitle: string) => {
      dispatch(todolistThunks.editTitleTodoList({ title: newTitle, todolistId }))
    }

    const removeTodoListHandler = () => {
      dispatch(todolistThunks.removeTodoList(todolistId))
    }

    const changeFilter = (todolistId: string, filter: FilterValuesType) => {
      dispatch(todolistActions.changeFilter({ id: todolistId, filter }))
    }

    const addTaskHandler = (title: string) => {
      dispatch(tasksThunks.addTask({ todolistId, title }))
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
          <Button variant={buttonClassALL} onClick={() => changeFilter(todolistId, 'all')}>
            All
          </Button>
          <Button variant={buttonClassActive} onClick={() => changeFilter(todolistId, 'active')}>
            Active
          </Button>
          <Button
            variant={buttonClassCompleted}
            onClick={() => changeFilter(todolistId, 'completed')}
          >
            Completed
          </Button>
        </div>
      </div>
    )
  }
)
