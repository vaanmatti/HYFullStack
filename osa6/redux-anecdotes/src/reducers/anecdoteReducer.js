import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdotes(state, action) {
      const votedAnecdote = action.payload
      const id = votedAnecdote.id
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : votedAnecdote
      )
    },
    appendAnecdotes(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { appendAnecdotes, setAnecdotes, voteAnecdotes } =
anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdotes(newAnecdote))
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const votedAnecdote = await anecdoteService.voteAnecdote({
      ...anecdote,
      votes: anecdote.votes +1
    })
    dispatch(voteAnecdotes(votedAnecdote))
  }
}
export default anecdoteSlice.reducer