import React, {FC, memo} from 'react'
import {TaskType} from 'common/api/task-api'
import Checkbox from '@mui/material/Checkbox/Checkbox'
import {EditableSpan} from 'common/comonents/EditableSpan'
import IconButton from '@mui/material/IconButton'
import {Delete} from '@mui/icons-material'
import {TaskStatuses} from 'common/enums/enums'
import {tasksThunks} from 'features/todolist/Todolist/Task/tasks-reducer'
import {useActions} from 'common/hooks/useActions'

type TaskPropsType = {
  task: TaskType
}
export const Task: FC<TaskPropsType> = memo(({ task }) => {
  const { updateTask, removeTask } = useActions(tasksThunks)

  const editTaskTitleHandler = (newTitle: string) => {
    updateTask({
      taskId: task.id,
      todolistId: task.todoListId,
      model: { title: newTitle },
    })
  }
  const removeTaskHandler = () => {
    removeTask({ todolistId: task.todoListId, taskId: task.id })
  }
  const changeTaskStatusHandler = () => {
    updateTask({
      taskId: task.id,
      todolistId: task.todoListId,
      model: {
        status: task.status === TaskStatuses.Completed ? TaskStatuses.New : TaskStatuses.Completed,
      },
    })
  }

  return (
    <div>
      <Checkbox
        checked={task.status === TaskStatuses.Completed}
        onChange={changeTaskStatusHandler}
      />

      <EditableSpan status={task.status} title={task.title} callBack={editTaskTitleHandler} />

      <IconButton aria-label='delete' onClick={removeTaskHandler}>
        <Delete />
      </IconButton>
    </div>
  )
})
