import Grid from '@mui/material/Grid/Grid'
import { AddItemForm } from 'common/comonents/AddItemForm'
import React, { useCallback, useEffect } from 'react'
import {
	TodolistDomainType,
	todolistThunks
} from 'features/todolist/Todolist/todolists-reducer'
import { useAppSelector } from 'common/hooks/useApp'
import { selectTodolists } from 'features/todolist/Todolist/todolists-selectors'
import { selectIsLoggedIn } from 'features/auth/auth-selectors'
import { Paper } from '@mui/material'
import { Todolist } from 'features/todolist/Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { selectTasks } from 'features/todolist/Todolist/Task/tasks-selectors'
import { TasksType } from 'features/todolist/Todolist/Task/tasks-reducer'
import { useActions } from 'common/hooks/useActions'

export const TodolistLists = () => {
	const { addTodoList, getTodoList } = useActions(todolistThunks)
	const todoLists: Array<TodolistDomainType> = useAppSelector(selectTodolists)
	const tasks: TasksType = useAppSelector(selectTasks)
	const isLoggedIn = useAppSelector(selectIsLoggedIn)

	const addTodoListCallback = useCallback((title: string) => {
		addTodoList(title)
	}, [])

	useEffect(() => {
		if (!isLoggedIn) {
			return
		}
		getTodoList()
	}, [])

	if (!isLoggedIn) {
		return <Navigate to='/login' />
	}

	return (
		<>
			<Grid container style={{ paddingTop: '10px' }}>
				<AddItemForm callBack={addTodoListCallback} />
			</Grid>
			<Grid container spacing={3}>
				{todoLists.map(el => {
					let tasksForRender = tasks[el.id]

					return (
						<Grid item key={el.id}>
							<Paper style={{ padding: '10px' }}>
								<Todolist
									key={el.id}
									todolistId={el.id}
									filter={el.filter}
									title={el.title}
									entityStatus={el.entityStatus}
									tasks={tasksForRender}
								/>
							</Paper>
						</Grid>
					)
				})}
			</Grid>
		</>
	)
}
