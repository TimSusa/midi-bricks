import { generateActions, createActionTypes } from 'redux-generate'

const TypePages = [
  'CREATE_PAGE',
  'UPDATE_PAGES',
  'DELETE_PAGES',
  'UPDATE_SLIDER_LIST_OF_PAGE'
]

export const ActionTypePages = createActionTypes(TypePages)

export const Actions = {...generateActions(ActionTypePages)}
