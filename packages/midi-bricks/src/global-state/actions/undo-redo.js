import { generateActions, createActionTypes } from 'redux-generate'

const TypeUndoRedo = [
  'UNDO_REDO_UPDATE',
  'UNDO_REDO_DELETE',
  'UNDO_REDO_LOAD',
]

export const ActionTypeUndoRedo = createActionTypes(TypeUndoRedo)

export const Actions = {...generateActions(ActionTypeUndoRedo)}
