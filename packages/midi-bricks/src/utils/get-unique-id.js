import { uniqueId } from 'lodash'

export function getUniqueId() {
  return uniqueId(new Date().getTime() + Math.random().toString(16))
}
