import React, { useEffect } from 'react'
import './App.css'
import { useAppSelector } from 'common/hooks/useApp'
import { selectAppStatus, selectIsInitialized } from 'app/app-selectors'
import { appThunks, RequestStatusType } from 'app/app-reducer'
import { CircularProgress, Container, LinearProgress } from '@mui/material'
import { ButtonAppBar } from 'common/comonents/ButtonAppBar'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ErrorSnackbar } from 'common/comonents/ErrorSnackbar'
import { Login } from 'features/auth/login/Login'
import { TodolistLists } from 'features/todolist/Todolist-lists'
import { useActions } from 'common/hooks/useActions'

export const App = () => {
  const status: RequestStatusType = useAppSelector(selectAppStatus)
  const isInitialized = useAppSelector<boolean>(selectIsInitialized)
  const { initializeApp } = useActions(appThunks)

  useEffect(() => {
    initializeApp({})
  }, [])

  if (!isInitialized) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '30%',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <CircularProgress />
      </div>
    )
  }
  return (
    <>
      <ButtonAppBar />
      {status === 'loading' && <LinearProgress color='secondary' />}
      <Container fixed>
        <Routes>
          <Route path='/' element={<TodolistLists />} />
          <Route path='login' element={<Login />} />
          <Route
            path='/404'
            element={<h1 style={{ textAlign: 'center' }}>404: PAGE NOT FOUND</h1>}
          />
          <Route path='*' element={<Navigate to='/404' />} />
        </Routes>
      </Container>
      <ErrorSnackbar />
    </>
  )
}
