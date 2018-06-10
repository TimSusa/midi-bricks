import createReducer from './createReducer'

const ActionType = {
  ADD_TODO: 'ADD_TODO',
  DELETE_TODO: 'DELETE_TODO',
  COMPLETE_TODO: 'COMPLETE_TODO',
  UNCOMPLETE_TODO: 'UNCOMPLETE_TODO'
}

export const todoList = createReducer([], {
  [ActionType.ADD_TODO] (state, action) {
    console.log('Add todo ', action.payload)
    return [...state, action.payload]
  },
  [ActionType.COMPLETE_TODO] (state, action) {
    // search after todo item with the given id and set completed to true
    return state.map(t => t.id === action.payload ? { ...t, completed: true } : t)
  },
  [ActionType.UNCOMPLETE_TODO] (state, action) {
    // search after todo item with the given id and set completed to false
    return state.map(t => t.id === action.payload ? { ...t, completed: false } : t)
  },
  [ActionType.DELETE_TODO] (state, action) {
    // remove all todos with the given id
    return state.filter(t => t.id !== action.payload)
  }
})
