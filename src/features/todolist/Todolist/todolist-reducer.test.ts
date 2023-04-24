import {
  FilterValuesType,
  todolistActions,
  TodolistDomainType,
  todoListsReducer,
  todolistThunks,
} from 'features/todolist/Todolist/todolists-reducer'

let todolistId1: string
let todolistId2: string

let startState: TodolistDomainType[]

beforeEach(() => {
  todolistId1 = 'todolistId1'
  todolistId2 = 'todolistId2'

  startState = [
    {
      id: todolistId1,
      title: 'What to learn',
      filter: 'all',
      order: 0,
      addedDate: 'string',
      entityStatus: 'idle',
    },
    {
      id: todolistId2,
      title: 'What to buy',
      filter: 'all',
      order: 0,
      addedDate: 'string',
      entityStatus: 'idle',
    },
  ]
})

test('correct todolist should be removed', () => {
  const action = todolistThunks.removeTodoList.fulfilled(
    { id: todolistId1 },
    'requestId',
    'todolistId1'
  )

  const endState = todoListsReducer(startState, action)

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should change its name', () => {
  let newTodolistTitle = 'New Todolist'

  const action = todolistThunks.editTitleTodoList.fulfilled(
    {
      title: newTodolistTitle,
      id: todolistId1,
    },
    'requestId',
    { todolistId: todolistId1, title: newTodolistTitle }
  )

  const endState = todoListsReducer(startState, action)

  expect(endState[0].title).toBe(newTodolistTitle)
  expect(endState[1].title).toBe('What to buy')
})

test('correct filter of todolist should be changed', () => {
  let newFilter: FilterValuesType = 'completed'

  const action = todolistActions.changeFilter({ filter: newFilter, id: todolistId2 })

  const endState = todoListsReducer(startState, action)

  expect(endState[0].filter).toBe('all')
  expect(endState[1].filter).toBe(newFilter)
})
