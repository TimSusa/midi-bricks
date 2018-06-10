// import { Action, ActionType, Todo } from '../model/model';

const ActionType = {
  ADD_TODO: 'ADD_TODO',
  DELETE_TODO: 'DELETE_TODO',
  COMPLETE_TODO: 'COMPLETE_TODO',
  UNCOMPLETE_TODO: 'UNCOMPLETE_TODO'
}

export function addTodo (todo) {
  return {
    type: ActionType.ADD_TODO,
    payload: todo
  }
}

// Async Function expample with redux-thunk
export function completeTodo (todoId) {
  // here you could do API eg

  return (dispatch, getState) => {
    dispatch({ type: ActionType.COMPLETE_TODO, payload: todoId })
  }
}

export function uncompleteTodo (todoId) {
  return {
    type: ActionType.UNCOMPLETE_TODO,
    payload: todoId
  }
}

export function deleteTodo (todoId) {
  return {
    type: ActionType.DELETE_TODO,
    payload: todoId
  }
}
