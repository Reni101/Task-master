import { TaskPriorities, TaskStatuses } from 'common/enums/enums'
import { instance, ResponseType } from './baseURL'

export const taskApi = {
  getTasks(todolistID: string) {
    return instance
      .get<GetTaskResponseType>(`todo-lists/${todolistID}/tasks`)
      .then((res) => res.data)
  },
  addTaskForTodolist(todolistID: string, titleTask: string) {
    return instance
      .post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistID}/tasks`, {
        title: titleTask,
      })
      .then((res) => res.data)
  },
  deleteTask(todolistID: string, taskId: string) {
    return instance
      .delete<ResponseType>(`/todo-lists/${todolistID}/tasks/${taskId}`)
      .then((res) => res.data)
  },
  updateTask(todolistID: string, taskId: string, model: modelType) {
    return instance
      .put<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistID}/tasks/${taskId}`, model)
      .then((res) => res.data)
  },
}

export type GetTaskResponseType = {
  totalCount: number
  error: string | null
  items: Array<TaskType>
}

export type modelType = {
  title?: string
  description?: string
  status?: number
  priority?: number
  startDate?: string
  deadline?: string
}

export type TaskType = {
  id: string
  title: string
  description: string
  todoListId: string
  order: number
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  addedDate: string
}
