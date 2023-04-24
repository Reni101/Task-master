import { tasksReducer, TasksType } from 'features/todolist/Todolist/Task/tasks-reducer'
import {
  TodolistDomainType,
  todoListsReducer,
  todolistThunks,
} from 'features/todolist/Todolist/todolists-reducer'
import { TodolistType } from 'common/api/todolist-api'
import { TaskStatuses } from 'common/enums/enums'

test('ids should be equals', () => {
  const startTaskState: TasksType = {}
  const startTodoListsState: TodolistDomainType[] = []

  let todolist: TodolistType = {
    title: 'new todolist',
    id: 'any id',
    addedDate: '',
    order: 0,
  }

  const action = todolistThunks.addTodoList.fulfilled(
    { newTodolist: todolist },
    'requestId',
    todolist.title
  )

  const endTasksState = tasksReducer(startTaskState, action)
  const endTodoListsState = todoListsReducer(startTodoListsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodoListsState[0].id

  expect(idFromTasks).toBe(action.payload.newTodolist.id)
  expect(idFromTodolists).toBe(action.payload.newTodolist.id)
})

test('property with todolistId1 should be deleted', () => {
  const startTaskState: TasksType = {
    todolistId1: [
      {
        id: '1',
        title: 'CSS',
        status: TaskStatuses.New,
        todoListId: 'todolistId1',
        startDate: 'string',
        order: 0,
        addedDate: 'string',
        description: 'string',
        deadline: 'string',
        priority: 0,
      },
      {
        id: '2',
        title: 'JS',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId1',
        startDate: 'string',
        order: 0,
        addedDate: 'string',
        description: 'string',
        deadline: 'string',
        priority: 0,
      },
      {
        id: '3',
        title: 'React',
        status: TaskStatuses.New,
        todoListId: 'todolistId1',
        startDate: 'string',
        order: 0,
        addedDate: 'string',
        description: 'string',
        deadline: 'string',
        priority: 0,
      },
    ],
    todolistId2: [
      {
        id: '1',
        title: 'bread',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        startDate: 'string',
        order: 0,
        addedDate: 'string',
        description: 'string',
        deadline: 'string',
        priority: 0,
      },
      {
        id: '2',
        title: 'milk',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId2',
        startDate: 'string',
        order: 0,
        addedDate: 'string',
        description: 'string',
        deadline: 'string',
        priority: 0,
      },
      {
        id: '3',
        title: 'tea',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        startDate: 'string',
        order: 0,
        addedDate: 'string',
        description: 'string',
        deadline: 'string',
        priority: 0,
      },
    ],
  }
  const startTodoListsState: TodolistDomainType[] = [
    {
      id: 'todolistId1',
      addedDate: '01.02.1993',
      order: 1,
      title: 'to do list 1',
      filter: 'all',
      entityStatus: 'idle',
    },
    {
      id: 'todolistId2',
      addedDate: '01.02.2001',
      order: 1,
      title: 'to do list 2',
      filter: 'all',
      entityStatus: 'idle',
    },
  ]

  const action = todolistThunks.removeTodoList.fulfilled(
    { id: 'todolistId1' },
    'requestId',
    'todolistId1'
  )
  const endTasksState = tasksReducer(startTaskState, action)
  const endTodoListsState = todoListsReducer(startTodoListsState, action)

  const keys = Object.keys(endTodoListsState)
  expect(keys.length).toBe(1)

  const keysTasks = Object.keys(endTasksState)
  expect(keysTasks.length).toBe(1)
})
