import React, { FC, memo } from 'react'
import { TaskType } from 'common/api/task-api'
import { FilterValuesType, todolistThunks } from 'features/todolist/Todolist/todolists-reducer'
import { EditableSpan } from 'common/comonents/EditableSpan'
import IconButton from '@mui/material/IconButton'
import { Delete } from '@mui/icons-material'
import { AddItemForm } from 'common/comonents/AddItemForm'
import { RequestStatusType } from 'app/app-reducer'
import { tasksThunks } from 'features/todolist/Todolist/Task/tasks-reducer'
import { Task } from 'features/todolist/Todolist/Task/Task'
import { TaskStatuses } from 'common/enums/enums'
import { useActions } from 'common/hooks/useActions'
import { FilterTasksButtons } from 'features/todolist/Todolist/filterTasksButtons/FilterTasksButtons'

type TodoListPropsType = {
  todolistId: string
  title: string
  entityStatus: RequestStatusType
  tasks: TaskType[]
  filter: FilterValuesType
}
export const Todolist: FC<TodoListPropsType> = memo(
  ({ todolistId, title, entityStatus, filter, tasks }) => {
    const { editTitleTodoList, removeTodoList, addTask } = useActions({
      ...todolistThunks,
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

    const addTaskHandler = (title: string) => {
     return addTask({ todolistId, title }).unwrap()
    }

    const tasksMap = tasks.length
      ? tasksForRender.map((task) => {
          return <Task key={task.id} task={task} />
        })
      : null

    return (
      <>
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

        {tasksMap}

        <FilterTasksButtons filter={filter} todolistId={todolistId} />
      </>
    )
  }
)
